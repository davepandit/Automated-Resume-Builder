import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PersonalDetailPreview from "../FourthUtility/PersonalDetailPreview";
import SummeryPreview from "../FourthUtility/SummeryPreview";
import ExperiencePreview from "../FourthUtility/ExperiencePreview";
import ProjectPreview from "../FourthUtility/ProjectPreview";
import EducationalPreview from "../FourthUtility/EducationPreview";
import SkillsPreview from "../FourthUtility/SkillsPreview";

const FourthTemplate = () => {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);

  // outer container centers card and limits width
  const pageStyle = {
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    boxSizing: "border-box",
    padding: "12px 18px",
    fontFamily: "'Georgia', 'Times New Roman', Times, serif",
    color: "#111827",
  };

  // two-column layout: left narrow, right flexible
  const containerStyle = {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    width: "100%",
    boxSizing: "border-box",
  };

  const leftColStyle = {
    flex: "0 0 34%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxSizing: "border-box",
  };

  const rightColStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxSizing: "border-box",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={leftColStyle}>
          {/* left column: summary, education, skills (and personal details remain here) */}
          <PersonalDetailPreview resumeInfo={resumeData} />
          <SummeryPreview resumeInfo={resumeData} />
          {resumeData?.education && <EducationalPreview resumeInfo={resumeData} />}
          {resumeData?.skills && <SkillsPreview resumeInfo={resumeData} />}
        </div>

        <div style={rightColStyle}>
          {/* right column: experience, projects */}
          {resumeData?.experience && <ExperiencePreview resumeInfo={resumeData} />}
          {resumeData?.projects && <ProjectPreview resumeInfo={resumeData} />}
        </div>
      </div>
    </div>
  );
};

export default FourthTemplate;
