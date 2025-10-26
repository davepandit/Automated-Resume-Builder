import React from "react";

function EducationalPreview({ resumeInfo }) {
  const formatDates = (edu) => {
    const start = edu?.startDate || "";
    const end = edu?.endDate || "";
    if (start && end) return `${start} - ${end}`;
    return start || end || "";
  };

  return (
    <div className="my-6 font-serif text-gray-900">
      {resumeInfo?.education?.length > 0 && (
        // header styled like the project/skills headings (serif, small uppercase with rule)
        <div className="mb-3 flex items-center gap-3">
          <h2
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: resumeInfo?.themeColor,
              letterSpacing: "0.22em",
            }}
          >
            Education
          </h2>
          <div
            style={{
              flex: 1,
              height: 1,
              background: resumeInfo?.themeColor,
              opacity: 0.9,
            }}
          />
        </div>
      )}

      {resumeInfo?.education?.map((education, index) => (
        <div key={index} className="my-5">
          <div className="flex items-start gap-4">
            {/* left: dates (wider so full date is visible) */}
            <div
              style={{
                minWidth: 180,
                flex: "0 0 180px",
                boxSizing: "border-box",
                whiteSpace: "nowrap", // keep on single line
              }}
              className="text-xs text-slate-600 pr-3 font-normal"
              title={formatDates(education)}
            >
              {formatDates(education)}
            </div>

            {/* center: main content using serif font for a polished look */}
            <div style={{ flex: 1 }}>
              <h2
                className="text-sm font-semibold font-serif"
                style={{ color: resumeInfo?.themeColor }}
              >
                {education.universityName}
              </h2>

              <div className="text-xs text-gray-700 font-serif">
                <span>
                  {education?.degree}
                  {education?.degree && education?.major ? " in " : null}
                  {education?.major}
                </span>
              </div>

              {education?.description ? (
                <p className="text-sm my-2 text-gray-700 leading-relaxed font-serif">
                  {education.description}
                </p>
              ) : null}
            </div>

            {/* right: grade/notes (fixed width) */}
            <div
              style={{
                width: 140,
                flex: "0 0 140px",
                boxSizing: "border-box",
                textAlign: "right",
              }}
              className="text-xs text-slate-800 font-serif"
            >
              {education?.grade
                ? `(${education?.gradeType || "GPA"}: ${education.grade})`
                : education?.notes
                ? `(${education.notes})`
                : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview;
