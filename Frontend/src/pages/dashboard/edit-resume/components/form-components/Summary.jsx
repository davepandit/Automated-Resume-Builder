import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
// import { AIChatSession } from "@/Services/AiModel"; // Retaining commented line
import { updateThisResume } from "@/Services/resumeAPI";

const prompt =
  "Job Title: {jobTitle} , Depends on job title give me list of summery for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summery and experience_level Field in JSON Format";

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null);
  const { resume_id } = useParams();

  const handleInputChange = (e) => {
    enanbledNext && enanbledNext(false);
    enanbledPrev && enanbledPrev(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Started Saving Summary");
    const data = {
      data: { summary },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then((data) => {
          toast.success("Summary Updated");
        })
        .catch((error) => {
          toast.error("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          enanbledNext && enanbledNext(true);
          enanbledPrev && enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const setSummery = (summary) => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: summary,
      })
    );
    setSummary(summary);
  };

  // Retaining the commented AI function structure for potential future use
  /*
  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    console.log("Generate Summery From AI for", resumeInfo?.jobTitle);
    if (!resumeInfo?.jobTitle) {
      toast.error("Please Add Job Title");
      setLoading(false);
      return;
    }
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const parsedResult = JSON.parse(result.response.text());
      console.log(parsedResult);
      setAiGenerateSummeryList(parsedResult);
      toast.success("Summary Suggestions Generated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate summary.", error.message);
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <div className="space-y-6">
      {/* Main Summary Section */}
      <div className="p-6 shadow-xl rounded-xl border-t-indigo-600 border-t-4 bg-white dark:bg-gray-800 mt-10 space-y-4">
        <div className="space-y-1">
          <h2 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">
            Achievements and Co-Curricular Activities
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Summarize your most impactful achievements and extracurriculars.
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSave}>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">
              Add your achievements and extra-curricular activities
            </label>
            <Textarea
              name="summary"
              className="min-h-[150px] border-gray-300 focus:border-indigo-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
              value={summary ? summary : resumeInfo?.summary}
              onChange={handleInputChange}
              placeholder="e.g., Led a team of 5 to win the national hackathon..."
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            {/* AI Generate Button (Commented out but styled for future use) */}
            {/*
            <Button 
                variant="outline"
                onClick={GenerateSummeryFromAI} 
                disabled={loading}
                className="flex items-center gap-2 text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 transition duration-200"
            >
                {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : <> <Sparkles className="w-4 h-4 fill-indigo-500 text-indigo-500" /> Generate with AI </>}
            </Button>
            */}
            <div className="flex-grow"></div> {/* Spacer */}
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:bg-indigo-400/50"
            >
              {loading ? (
                <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* AI Suggestions Section (Only renders if aiGeneratedSummeryList is not null) */}
      {aiGeneratedSummeryList && (
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">
            AI Suggestions
          </h2>
          {aiGeneratedSummeryList?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enanbledNext && enanbledNext(false);
                enanbledPrev && enanbledPrev(false);
                setSummery(item?.summary);
              }}
              // Stylish suggestion card
              className="p-4 shadow-md rounded-xl cursor-pointer border border-gray-200 hover:border-indigo-500 transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h3 className="font-extrabold my-1 text-indigo-600 dark:text-indigo-400">
                Level: {item?.experience_level}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {item?.summary}
              </p>
              <span className="text-xs text-blue-500 mt-2 block hover:underline">
                Click to use this summary
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
