import React from "react";

function SkillsPreview({ resumeInfo }) {
  return (
    <div className="my-3">
      {resumeInfo?.skills?.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            width: "100%",
            marginBottom: 6,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: resumeInfo?.themeColor || "#000",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            Skills
          </h2>
          <div
            style={{
              width: "100%",
              height: 1.5,
              background: resumeInfo?.themeColor || "#000",
              marginTop: 4,
              border: "none",
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {resumeInfo?.skills?.map((skill, index) => {
          const percent = Math.round((skill?.rating || 0) * 20);
          return (
            <div
              key={index}
              className="min-w-[120px] max-w-[200px] flex-1 bg-white border border-gray-100 rounded-md p-2"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-gray-800">{skill.name}</h3>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  {percent}%
                </span>
              </div>

              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${percent}%`,
                    background: resumeInfo?.themeColor,
                    transition: "width 350ms ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsPreview;
