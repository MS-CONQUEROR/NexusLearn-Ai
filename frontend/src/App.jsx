import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import InputBar from "./components/InputBar"

const API = "https://nexuslearn-ai-production.up.railway.app"

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your academic assistant. Upload your notes, textbooks, or question papers and ask me anything. I can also chat freely without any documents.",
      sources: [],
      route: "chat"
    }
  ])
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)

  // fetch uploaded docs for sidebar
  const fetchSources = async () => {
    try {
      const res = await axios.get(`${API}/sources`)
      setSources(res.data.sources)
    } catch (err) {
      console.error("Failed to fetch sources", err)
    }
  }

  useEffect(() => {
    fetchSources()
  }, [])

  const sendMessage = async (text) => {
    if (!text.trim()) return

    // add user message immediately
    const userMsg = { role: "user", content: text, sources: [], route: "" }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // build history for the API
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content
      }))

      const res = await axios.post(`${API}/chat`, {
        message: text,
        history: history
      })

      const aiMsg = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
        route: res.data.route || "chat"
      }

      setMessages([...updatedMessages, aiMsg])
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please check if the backend is running.",
          sources: [],
          route: "error"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      // refresh sidebar
      await fetchSources()

      // show upload success message in chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ **${res.data.filename}** uploaded successfully! ${res.data.pages} pages processed into ${res.data.chunks} chunks. You can now ask questions about it.`,
          sources: [],
          route: "system"
        }
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Failed to upload file. Make sure it's a PDF, DOCX, or PPTX.`,
          sources: [],
          route: "error"
        }
      ])
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f0f0f" }}>
      <Sidebar sources={sources} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChatWindow messages={messages} loading={loading} />
        <InputBar onSend={sendMessage} onUpload={handleUpload} loading={loading} />
      </div>
    </div>
  )
}