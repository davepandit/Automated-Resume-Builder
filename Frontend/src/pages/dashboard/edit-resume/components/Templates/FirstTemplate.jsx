import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PersonalDeatailPreview from "../preview-components/PersonalDeatailPreview";
import SummeryPreview from "../preview-components/SummaryPreview";
import ExperiencePreview from "../preview-components/ExperiencePreview";
import EducationalPreview from "../preview-components/EducationalPreview";
import SkillsPreview from "../preview-components/SkillsPreview";
import ProjectPreview from "../preview-components/ProjectPreview";

const FirstTemplate = () => {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);
  return (
    <>
      <PersonalDeatailPreview resumeInfo={resumeData} />
      <SummeryPreview resumeInfo={resumeData} />
      {resumeData?.experience && <ExperiencePreview resumeInfo={resumeData} />}
      {resumeData?.projects && <ProjectPreview resumeInfo={resumeData} />}
      {resumeData?.education && <EducationalPreview resumeInfo={resumeData} />}
      {resumeData?.skills && <SkillsPreview resumeInfo={resumeData} />}
    </>
  );
};

export default FirstTemplate;
