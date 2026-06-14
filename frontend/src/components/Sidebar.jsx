import { FileText, Presentation, File, BookOpen } from "lucide-react"

const typeConfig = {
  pdf:  { color: "#fc8181", bg: "#2d1b1b", label: "PDF" },
  docx: { color: "#63b3ed", bg: "#1a2535", label: "DOCX" },
  pptx: { color: "#f6ad55", bg: "#2d2010", label: "PPTX" },
}

const TypeIcon = ({ type }) => {
  if (type === "pptx") return <Presentation size={13} />
  if (type === "docx") return <FileText size={13} />
  return <File size={13} />
}

export default function Sidebar({ sources }) {
  return (
    <div style={{
      width: "230px",
      borderRight: "1px solid #1e2433",
      display: "flex",
      flexDirection: "column",
      background: "#0d1117",
      flexShrink: 0
    }}>
      {/* logo area */}
      <div style={{
        padding: "18px 16px 14px",
        borderBottom: "1px solid #1e2433",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <BookOpen size={16} style={{ color: "#4299e1" }} />
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0" }}>
          NexusLearn AI
        </span>
      </div>

      {/* label */}
      <div style={{ padding: "12px 16px 6px" }}>
        <p style={{
          fontSize: "10px", color: "#4a5568",
          fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          Study Materials
        </p>
      </div>

      {/* filter tabs */}
      <div style={{ display: "flex", gap: "4px", padding: "0 8px 8px" }}>
        {["All", "PDF", "DOCX", "PPTX"].map((tab) => (
          <button key={tab} style={{
            fontSize: "11px", padding: "3px 8px",
            borderRadius: "6px", border: "1px solid #1e2433",
            background: tab === "All" ? "#1e3a5f" : "transparent",
            color: tab === "All" ? "#63b3ed" : "#4a5568",
            cursor: "pointer", fontWeight: tab === "All" ? 600 : 400,
            transition: "all 0.15s"
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* doc list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {sources.length === 0 ? (
          <div style={{ padding: "28px 12px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#4a5568", lineHeight: 1.7 }}>
              No documents yet.<br />Click + to upload.
            </p>
          </div>
        ) : (
          sources.map((src, i) => {
            const config = typeConfig[src.source_type] || typeConfig.pdf
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "7px 8px", borderRadius: "8px",
                cursor: "pointer", marginBottom: "2px",
                transition: "background 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1a2535"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ color: config.color, flexShrink: 0 }}>
                  <TypeIcon type={src.source_type} />
                </span>
                <span style={{
                  fontSize: "12px", color: "#a0aec0", flex: 1,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {src.source}
                </span>
                <span style={{
                  fontSize: "10px", padding: "2px 6px", borderRadius: "99px",
                  background: config.bg, color: config.color,
                  flexShrink: 0, fontWeight: 600
                }}>
                  {config.label}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* footer */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid #1e2433",
        fontSize: "11px", color: "#4a5568"
      }}>
        {sources.length} file{sources.length !== 1 ? "s" : ""} indexed
      </div>
    </div>
  )
}