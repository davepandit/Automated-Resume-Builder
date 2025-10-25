import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = React.useState({});
  const { resume_id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const template = query.get("template");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);
  const fetchResumeInfo = async () => {
    const response = await getResumeData(resume_id);
    // console.log(response.data);
    dispatch(addResumeData(response.data));
  };

  // Improved PDF download function
  const downloadAsPDF = async () => {
    try {
      // Dynamically import the libraries
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.querySelector(".print");
      if (!element) {
        toast.error("Resume content not found");
        return;
      }

      // Store original styles
      const originalWidth = element.style.width;
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;

      // Set fixed dimensions for PDF generation
      element.style.width = "210mm";
      element.style.height = "297mm";
      element.style.overflow = "visible";

      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
      });

      // Restore original styles
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit the page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95; // 95% to prevent overflow

      pdf.addImage(
        imgData,
        "PNG",
        (pdfWidth - imgWidth * ratio) / 2,
        (pdfHeight - imgHeight * ratio) / 2,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save("resume.pdf");
      toast.success("Resume downloaded as PDF successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF. Please try the print option.");
    }
  };

  // Improved Word download function
  const downloadAsWord = () => {
    try {
      const element = document.querySelector(".print");
      if (!element) {
        toast.error("Resume content not found");
        return;
      }

      // Clone the element to avoid modifying the original
      const clone = element.cloneNode(true);

      // Remove any buttons or interactive elements that might be in the preview
      const buttons = clone.querySelectorAll("button, a, .no-print");
      buttons.forEach((btn) => btn.remove());

      // Get clean HTML content
      const htmlContent = clone.innerHTML;

      // Create a proper Word document with styles
      const header = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:w="urn:schemas-microsoft-com:office:word" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <title>Resume</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.4;
            }
            .print { 
              width: 100%; 
              max-width: 800px; 
              margin: 0 auto; 
            }
            * { 
              box-sizing: border-box; 
            }
            @page {
              margin: 0.5in;
            }
          </style>
        </head>
        <body>
      `;

      const footer = `
        </body>
        </html>
      `;

      const sourceHTML = header + htmlContent + footer;

      // Create Blob and download
      const blob = new Blob([sourceHTML], {
        type: "application/msword",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.doc";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success("Resume downloaded as Word document successfully!");
    } catch (error) {
      console.error("Error generating Word document:", error);
      toast.error("Failed to download Word document. Please try PDF download.");
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div id="noPrint">
          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            <h2 className="text-center text-2xl font-medium">
              Congrats! Your Ultimate AI generated Resume is ready !{" "}
            </h2>
            <p className="text-center text-gray-400">
              Now you are ready to download your resume and you can share unique
              resume url with recruiters{" "}
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-10 px-4 md:px-44">
              <div className="flex flex-wrap justify-center gap-2">
                {/* <Button onClick={HandleDownload}>Download PDF (Print)</Button> */}
                <Button onClick={downloadAsPDF}>Download as PDF</Button>
                <Button onClick={downloadAsWord}>Download as Word</Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className=" bg-white rounded-lg p-8 print-area"
          style={{ width: "210mm", height: "297mm" }}
        >
          <div className="print">
            <ResumePreview template={template} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewResume;
