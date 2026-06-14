import { useEffect, useRef } from "react"
import Message from "./Message"

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  return (
    <div style={{
      flex: 1, overflowY: "auto",
      padding: "28px 24px 8px",
      display: "flex", flexDirection: "column",
      background: "#0f1117"
    }}>
      {messages.map((msg, i) => <Message key={i} message={msg} />)}

      {loading && (
        <div style={{ display: "flex", gap: "5px", padding: "8px 0" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#4299e1",
              animation: "pulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`
            }} />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}