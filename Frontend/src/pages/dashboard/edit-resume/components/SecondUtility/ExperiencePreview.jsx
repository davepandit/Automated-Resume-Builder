import React from "react";

function ExperiencePreview({ resumeInfo }) {
  const theme = resumeInfo?.themeColor || "#111";

  const formatLocation = (exp) => {
    const parts = [];
    if (exp?.companyName) parts.push(exp.companyName);
    if (exp?.city) parts.push(exp.city);
    if (exp?.state) parts.push(exp.state);
    return parts.join(", ");
  };

  const formatDates = (exp) => {
    if (!exp) return "";
    const start = exp.startDate || "";
    const end = exp.currentlyWorking ? "Present" : exp.endDate || "";
    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    if (end) return end;
    return "";
  };

  return (
    <div className="my-6">
      {resumeInfo?.experience?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h2
              className="font-serif text-sm uppercase tracking-wider"
              style={{ color: theme, letterSpacing: "0.12em" }}
            >
              Work Experience
            </h2>
            <div
              style={{
                flex: 1,
                borderTop: "1px solid",
                borderColor: theme,
              }}
            />
          </div>
        </div>
      )}

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <h3
                className="font-serif font-semibold text-sm"
                style={{ color: "#000" }}
              >
                {experience?.title}
              </h3>
              <div className="text-xs mt-1" style={{ color: "#111" }}>
                {formatLocation(experience)}
              </div>
            </div>

            <div className="text-xs text-right" style={{ color: "#111" }}>
              {formatDates(experience)}
            </div>
          </div>

          <div
            className="text-xs mt-3 leading-relaxed"
            style={{ color: "#111" }}
            dangerouslySetInnerHTML={{ __html: experience?.workSummary || "" }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
