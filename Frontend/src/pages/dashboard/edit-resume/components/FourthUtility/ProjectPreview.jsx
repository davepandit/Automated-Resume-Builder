import React from "react";

function bulletsFromText(text = "") {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const hasBullets = lines.some((l) => /^[-•*]\s+/.test(l));
  return hasBullets ? lines.map((l) => l.replace(/^[-•*]\s+/, "")) : null;
}

function containsHTML(text = "") {
  return /<\/?[a-z][\s\S]*>/i.test(String(text));
}

function createMarkup(html = "") {
  if (typeof window !== "undefined" && window.DOMPurify) {
    return { __html: window.DOMPurify.sanitize(String(html)) };
  }
  return { __html: String(html) };
}

export default function ProjectPreview({ resumeInfo = {} }) {
  const theme = resumeInfo?.themeColor || "#111";
  const projects = Array.isArray(resumeInfo?.projects) ? resumeInfo.projects : [];

  if (!projects.length) return null;

  return (
    <section style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "Times New Roman, serif",
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: theme,
          }}
        >
          Projects
        </h2>
        <div style={{ flex: 1, borderTop: `1px solid ${theme}` }} />
      </div>

      {projects.map((p, i) => {
        const name = p?.projectName || p?.title || "Some Project";
        const link = p?.demoLink || p?.link || p?.projectLink || "";
        const tech = p?.techStack ? String(p.techStack).split(",").map((t) => t.trim()).join(" | ") : "";
        const summary = p?.projectSummary || p?.description || "";
        const bullets = bulletsFromText(summary);
        const hasHtml = containsHTML(summary);

        return (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Times New Roman, serif" }}>{name}</div>
              {link ? (
                <a
                  href={link.startsWith("http") ? link : `https://${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme, fontSize: 12 }}
                >
                  Link to Demo
                </a>
              ) : null}
            </div>

            {tech && <div style={{ marginTop: 4, fontSize: 12, color: "#222" }}>{tech}</div>}

            <div style={{ marginTop: 6, fontSize: 12, color: "#111" }}>
              {hasHtml ? (
                <div dangerouslySetInnerHTML={createMarkup(summary)} />
              ) : bullets ? (
                <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>{bullets.map((b, idx) => <li key={idx} style={{ marginBottom: 6 }}>{b}</li>)}</ul>
              ) : (
                <p style={{ margin: 0 }}>{summary}</p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
