import React from "react";

function ProjectPreview({ resumeInfo }) {
  const theme = resumeInfo?.themeColor || "#111";
  const projects = resumeInfo?.projects || [];

  return (
    <div className="my-6">
      {projects.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-3">
            <h2
              className="font-serif text-sm uppercase tracking-wider"
              style={{ color: theme, letterSpacing: "0.12em" }}
            >
              PROJECTS
            </h2>
            <div style={{ flex: 1, borderTop: "1px solid", borderColor: theme }} />
          </div>
        </div>
      )}

      {projects.map((project, index) => {
        const demoHref =
          project?.demoLink || project?.link || project?.projectLink || "";
        const tech = project?.techStack
          ? project.techStack.split(",").map((t) => t.trim()).join(" | ")
          : "";

        return (
          <div key={index} className="my-5">
            <div className="flex justify-between items-start">
              <h3 className="font-serif font-semibold text-sm" style={{ color: "#000" }}>
                {project?.projectName}
              </h3>

              {demoHref ? (
                <a
                  href={demoHref.startsWith("http") ? demoHref : `https://${demoHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ color: theme }}
                >
                  Link to Demo
                </a>
              ) : null}
            </div>

            {tech && (
              <div className="text-xs mt-1 text-slate-700" style={{ color: "#111" }}>
                {tech}
              </div>
            )}

            <div
              className="text-xs mt-2 text-justify leading-relaxed"
              style={{ color: "#111" }}
              dangerouslySetInnerHTML={{ __html: project?.projectSummary || "" }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ProjectPreview;
