import { useRef, useState } from "react"
import { Plus, ArrowUp, X } from "lucide-react"

export default function InputBar({ onSend, onUpload, loading }) {
  const [text, setText] = useState("")
  const [pendingFile, setPendingFile] = useState(null)
  const fileRef = useRef(null)

  const handleSend = () => {
    if (loading) return
    if (pendingFile) { onUpload(pendingFile); setPendingFile(null) }
    if (text.trim()) { onSend(text.trim()); setText("") }
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) setPendingFile(file)
    e.target.value = ""
  }

  const canSend = !loading && (text.trim() || pendingFile)

  return (
    <div style={{
      padding: "12px 20px 18px",
      borderTop: "1px solid #1e2433",
      background: "#0d1117"
    }}>
      {pendingFile && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "4px 10px", borderRadius: "99px",
          background: "#1a2535", border: "1px solid #2a4a7f",
          fontSize: "12px", color: "#63b3ed", marginBottom: "8px"
        }}>
          <span>{pendingFile.name}</span>
          <X size={12} style={{ cursor: "pointer", color: "#4a5568" }}
            onClick={() => setPendingFile(null)} />
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "flex-end", gap: "8px",
        border: "1px solid #1e2433", borderRadius: "14px",
        padding: "8px 10px 8px 8px", background: "#141a24",
        boxShadow: "0 0 0 1px #1e2d4a"
      }}>
        <button onClick={() => fileRef.current.click()} style={{
          width: "32px", height: "32px", borderRadius: "8px",
          border: "1px solid #1e2433", background: "#1a2535",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#4a5568", flexShrink: 0,
          transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4299e1"; e.currentTarget.style.color = "#63b3ed" }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2433"; e.currentTarget.style.color = "#4a5568" }}
          title="Upload PDF, DOCX, or PPTX"
        >
          <Plus size={16} />
        </button>

        <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx"
          style={{ display: "none" }} onChange={handleFile} />

        <textarea value={text} onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your notes, solve a question, or chat freely…"
          rows={1} style={{
            flex: 1, background: "transparent", border: "none",
            outline: "none", color: "#e2e8f0", fontSize: "14px",
            resize: "none", lineHeight: 1.6, padding: "4px 6px",
            fontFamily: "inherit", maxHeight: "120px", overflowY: "auto"
          }}
          onInput={e => {
            e.target.style.height = "auto"
            e.target.style.height = e.target.scrollHeight + "px"
          }}
        />

        <button onClick={handleSend} disabled={!canSend} style={{
          width: "32px", height: "32px", borderRadius: "8px",
          border: "none",
          background: canSend ? "#4299e1" : "#1e2433",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: canSend ? "pointer" : "not-allowed",
          color: canSend ? "#fff" : "#4a5568",
          flexShrink: 0, transition: "all 0.15s"
        }}>
          <ArrowUp size={16} />
        </button>
      </div>

      <p style={{ fontSize: "11px", color: "#2d3748", textAlign: "center", marginTop: "8px" }}>
        Supports PDF, DOCX, PPTX · Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}