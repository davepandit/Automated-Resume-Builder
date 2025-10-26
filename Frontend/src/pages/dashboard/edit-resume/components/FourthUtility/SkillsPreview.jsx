import React from "react";

function SkillsPreview({ resumeInfo }) {
  return (
    <div className="my-6">
      {resumeInfo?.skills?.length > 0 && (
        <div className="mb-3 text-center">
          <h2
            className="text-sm font-semibold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            Skills
          </h2>
          <div
            className="mx-auto mt-2 h-1 w-24 rounded"
            style={{ background: resumeInfo?.themeColor + "33" }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {resumeInfo?.skills?.map((skill, index) => {
          const percent = Math.round((skill?.rating || 0) * 20);
          return (
            <div
              key={index}
              className="min-w-[160px] max-w-[240px] flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-800">{skill.name}</h3>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  {percent}%
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percent}%`,
                    background: resumeInfo?.themeColor,
                    transition: "width 450ms ease",
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
