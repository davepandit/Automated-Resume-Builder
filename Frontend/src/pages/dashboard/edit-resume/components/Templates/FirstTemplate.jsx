import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PersonalDetailPreview from "../preview-components/PersonalDetailPreview";
import SummaryPreview from "../preview-components/SummaryPreview";
import ExperiencePreview from "../preview-components/ExperiencePreview";
import ProjectPreview from "../preview-components/ProjectPreview";
import EducationalPreview from "../preview-components/EducationalPreview";
import SkillsPreview from "../preview-components/SkillsPreview";
const FirstTemplate = () => {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);
  return (
    <>
      <PersonalDetailPreview resumeInfo={resumeData} />
      <SummaryPreview resumeInfo={resumeData} />
      {resumeData?.experience && <ExperiencePreview resumeInfo={resumeData} />}
      {resumeData?.projects && <ProjectPreview resumeInfo={resumeData} />}
      {resumeData?.education && <EducationalPreview resumeInfo={resumeData} />}
      {resumeData?.skills && <SkillsPreview resumeInfo={resumeData} />}
    </>
  );
};

export default FirstTemplate;
