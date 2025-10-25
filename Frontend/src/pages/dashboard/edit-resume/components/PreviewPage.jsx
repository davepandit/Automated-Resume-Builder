import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FirstTemplate from "./Templates/FirstTemplate";
import SecondTemplate from "./Templates/SecondTemplate";
import ThirdTemplate from "./Templates/ThirdTemplate";
import FourthTemplate from "./Templates/FourthTemplate";

function PreviewPage({ template }) {
  const resumeData = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    console.log("PreviewPage rendered ");
  }, [resumeData]);
  return (
    <div
      className={`shadow-lg h-full p-14 border-t-[20px]`}
      style={{
        borderColor: resumeData?.themeColor ? resumeData.themeColor : "#000000",
      }}
    >
      {/* dynamically render the template based on what the user has chosen  */}
      {template === "first-template" ? (
        <FirstTemplate />
      ) : template === "second-template" ? (
        <SecondTemplate />
      ) : template === "third-template" ? (
        <ThirdTemplate />
      ) : (
        <FourthTemplate />
      )}
    </div>
  );
}

export default PreviewPage;
