import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "@/Services/AiModel";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

// The PROMPT constant remains unchanged as requested
const PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project
"techStack":A string representing the project tech stack
"projectSummary": An array of strings, each representing a bullet point in html format describing relevant experience for the given project tittle and tech stack
projectName-"{projectName}"
techStack-"{techStack}"`;

function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  // Logic remains the same
  useEffect(() => {
    // Note: Passed `value` to the callback for immediate update, matching the logic in the onChange below
    onRichTextEditorChange(value);
  }, [value, onRichTextEditorChange]);

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    const prompt = PROMPT.replace(
      "{projectName}",
      resumeInfo?.projects[index]?.projectName
    ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);

    console.log("Prompt", prompt);
    // Logic remains the same
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const resp = JSON.parse(result.response.text());
      console.log("Response", resp);
      await setValue(resp.projectSummary?.join("") || ""); // Ensure setting to an empty string if undefined
    } catch (error) {
      toast.error("Failed to parse AI response. Try again.");
      console.error("AI Generation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header and AI Button Section */}
      <div className="flex justify-between items-center my-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Summary
        </label>

        {/* ⭐️ Stylish AI Button ⭐️ */}
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          // Stylish classes: Indigo accent, shadow, transition
          className="flex items-center gap-2 text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-800 transition duration-200 shadow-sm"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin w-4 h-4" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 fill-indigo-500 text-indigo-500" />{" "}
              Generate from AI
            </>
          )}
        </Button>
      </div>

      {/* ⭐️ Editor Container: Clean, modern look ⭐️ */}
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Calling the callback with the new event value
            onRichTextEditorChange(e.target.value);
          }}
          // Stylish wrapper classes for the editor area
          containerProps={{
            style: {
              borderRadius: "0.5rem", // rounded-lg
              borderColor: "#d1d5db", // border-gray-300
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // subtle shadow
              borderWidth: "1px", // ensures visible border
            },
          }}
          // Stylish classes for the content area
          contentEditableProps={{
            className:
              "min-h-[150px] p-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none",
            style: { minHeight: "150px" },
          }}
        >
          {/* ⭐️ Stylish Toolbar ⭐️ */}
          <Toolbar className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg border-b border-gray-200 dark:border-gray-600 space-x-1">
            <BtnBold className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
            <BtnItalic className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
            <BtnUnderline className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
            <BtnStrikeThrough className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
            <Separator className="border-gray-300 dark:border-gray-500" />
            <BtnNumberedList className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
            <BtnBulletList className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
            <Separator className="border-gray-300 dark:border-gray-500" />
            <BtnLink className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default SimpeRichTextEditor;
