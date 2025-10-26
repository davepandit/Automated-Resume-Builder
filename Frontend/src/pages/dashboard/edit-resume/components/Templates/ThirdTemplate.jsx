import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PersonalDetailPreview from "../ThirdUtility/PersonalDetailPreview";
import SummeryPreview from "../ThirdUtility/SummeryPreview";
import ExperiencePreview from "../ThirdUtility/ExperiencePreview";
import ProjectPreview from "../ThirdUtility/ProjectPreview";
import EducationalPreview from "../ThirdUtility/EducationPreview";
import SkillsPreview from "../ThirdUtility/SkillsPreview";

const ThirdTemplate = () => {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);

  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      padding: 0,
      margin: 0,
      background: "transparent",
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "'Georgia', 'Times New Roman', Times, serif",
    },
    card: {
      width: "100%",
      maxWidth: 900,
      margin: "0 auto",
      background: "#fff",
      borderRadius: 8,
      boxShadow: "none",
      overflow: "hidden",
      color: "#111827",
      border: "none",
    },
    
    header: {
      display: "block",
      padding: "12px 12px",        // reduced padding to save vertical space
      borderBottom: "none",       // removed the thin grey bar
    },
    leftHeader: { width: "100%" },
    content: {
      padding: 12,                // reduced overall content padding
      display: "grid",
      gap: 10,                    // smaller gap between sections
    },
    section: {
      paddingTop: 4,              // reduced top padding
    },
    sectionBox: {
      padding: 10,                // reduced inner padding to save space
      borderRadius: 8,
      border: "1px solid #f1f5f9",
      background: "#ffffff",
    },
    sectionTitleLine: {
      height: 1.5,
      background: "#2e1350",
      marginTop: 6,
      borderRadius: 1,
      width: "100%",
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: "#2e1350",
      marginBottom: 6,
      textAlign: "center",
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.leftHeader}>
           
            <PersonalDetailPreview resumeInfo={resumeData} />
          </div>
        </div>

        <div style={styles.content}>
          <div style={{ ...styles.section, ...styles.sectionBox }}>
            
            <div style={{ marginTop: 10 }}>
              <SummeryPreview resumeInfo={resumeData} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {resumeData?.experience && (
              <div style={{ ...styles.sectionBox }}>
                <ExperiencePreview resumeInfo={resumeData} />
              </div>
            )}

            {resumeData?.projects && (
              <div style={{ ...styles.sectionBox }}>
                <ProjectPreview resumeInfo={resumeData} />
              </div>
            )}

            {resumeData?.education && (
              <div style={{ ...styles.sectionBox }}>
                <EducationalPreview resumeInfo={resumeData} />
              </div>
            )}

            {resumeData?.skills && (
              <div style={{ ...styles.sectionBox }}>
                <SkillsPreview resumeInfo={resumeData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdTemplate;
