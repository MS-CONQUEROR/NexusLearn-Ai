import { FileText, Presentation, File } from "lucide-react"

const routeConfig = {
  topic_explainer:         { label: "Topic Explainer",  color: "#63b3ed", bg: "#1a2535" },
  question_solver:         { label: "Question Solver",  color: "#68d391", bg: "#1a2d1a" },
  learning_path_generator: { label: "Learning Path",    color: "#f6ad55", bg: "#2d2010" },
  content_synthesizer:     { label: "Multi-Source",     color: "#b794f4", bg: "#231a35" },
}

const SourcePill = ({ source }) => {
  const icons = { pdf: <File size={11} />, docx: <FileText size={11} />, pptx: <Presentation size={11} /> }
  const colors = { pdf: "#fc8181", docx: "#63b3ed", pptx: "#f6ad55" }
  const color = colors[source.source_type] || "#a0aec0"

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 9px", borderRadius: "99px",
      border: `1px solid ${color}33`,
      background: "#1a202c", color: color,
      fontSize: "11px", cursor: "pointer",
      marginRight: "6px", marginTop: "5px",
      transition: "all 0.15s"
    }}
      onMouseEnter={e => e.currentTarget.style.background = "#2d3748"}
      onMouseLeave={e => e.currentTarget.style.background = "#1a202c"}
    >
      {icons[source.source_type] || <File size={11} />}
      <span style={{ color: "#718096" }}>
        {source.source}{source.page ? ` · p.${source.page}` : ""}
      </span>
    </div>
  )
}

export default function Message({ message }) {
  const isUser = message.role === "user"
  const routeInfo = routeConfig[message.route]

  return (
    <div className="msg-animate" style={{
      display: "flex", flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: "20px", maxWidth: "82%",
      alignSelf: isUser ? "flex-end" : "flex-start"
    }}>
      {!isUser && routeInfo && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "3px 10px", borderRadius: "99px",
          background: routeInfo.bg, color: routeInfo.color,
          fontSize: "11px", marginBottom: "6px",
          border: `1px solid ${routeInfo.color}33`, fontWeight: 600
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: routeInfo.color
          }} />
          {routeInfo.label}
        </div>
      )}

      <div style={{
        padding: isUser ? "10px 16px" : "0",
        borderRadius: isUser ? "14px 14px 4px 14px" : "0",
        background: isUser ? "#1e3a5f" : "transparent",
        border: isUser ? "1px solid #2a4a7f" : "none",
        fontSize: "14px", lineHeight: 1.75,
        color: isUser ? "#bee3f8" : "#cbd5e0",
        maxWidth: "100%"
      }}>
        <div className="message-content" dangerouslySetInnerHTML={{
          __html: message.content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br/>")
        }} />
      </div>

      {message.sources && message.sources.length > 0 && (
        <div style={{ marginTop: "4px", display: "flex", flexWrap: "wrap" }}>
          {message.sources.map((src, i) => <SourcePill key={i} source={src} />)}
        </div>
      )}
    </div>
  )
}