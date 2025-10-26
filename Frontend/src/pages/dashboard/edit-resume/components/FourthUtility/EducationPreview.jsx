import React from "react";

function EducationalPreview({ resumeInfo }) {
  const formatDates = (edu) => {
    const start = edu?.startDate || "";
    const end = edu?.endDate || "";
    if (start && end) return `${start} - ${end}`;
    return start || end || "";
  };

  return (
    <div className="my-6">
      {resumeInfo?.education.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-2"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            Education
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}

      {resumeInfo?.education.map((education, index) => (
        <div key={index} className="my-5">
          {/* row: content on left, date column on right */}
          <div className="flex items-start gap-4">
            <div style={{ flex: 1 }}>
              <h2
                className="text-sm font-bold"
                style={{
                  color: resumeInfo?.themeColor,
                }}
              >
                {education.universityName}
              </h2>

              <div className="text-xs text-gray-700">
                <span>
                  {education?.degree}
                  {education?.degree && education?.major ? " in " : null}
                  {education?.major}
                </span>
              </div>

              <div className="text-xs text-slate-800 mt-1">
                {education?.grade ? `${education?.gradeType || "GPA"} - ${education?.grade}` : null}
              </div>

              {education?.description ? (
                <p className="text-xs my-2 text-gray-700">
                  {education?.description}
                </p>
              ) : null}
            </div>

            {/* fixed-width date column to keep dates fully visible and aligned */}
            <div
              style={{
                minWidth: 160,
                flex: "0 0 160px",
                boxSizing: "border-box",
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
              className="text-xs text-slate-600"
              title={formatDates(education)}
            >
              {formatDates(education)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview;
