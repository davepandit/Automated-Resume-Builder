import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PersonalDetailPreview from "../SecondUtility/PersonalDetailPreview";
import SummeryPreview from "../SecondUtility/SummeryPreview";
import ExperiencePreview from "../SecondUtility/ExperiencePreview";
import EducationalPreview from "../SecondUtility/EducationPreview";
import SkillsPreview from "../SecondUtility/SkillsPreview";
import ProjectPreview from "../SecondUtility/ProjectPreview";

const SecondTemplate = () => {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);
  return (
    <>
      <PersonalDetailPreview resumeInfo={resumeData} />
      <SummeryPreview resumeInfo={resumeData} />
      {resumeData?.experience && <ExperiencePreview resumeInfo={resumeData} />}
      {resumeData?.projects && <ProjectPreview resumeInfo={resumeData} />}
      {resumeData?.education && <EducationalPreview resumeInfo={resumeData} />}
      {resumeData?.skills && <SkillsPreview resumeInfo={resumeData} />}
    </>
  );
};

export default SecondTemplate;
