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
    "position_Title": A string representing the job title.
    "experience": An array of strings, each representing a bullet point describing relevant experience for the given job title in html format.
For the Job Title "{positionTitle}", create a JSON object with the following fields:
The experience array should contain 5-7 bullet points. Each bullet point should be a concise description of a relevant skill, responsibility, or achievement and all point should be extremely related to entered data.`;

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false);

  // Logic remains the same
  useEffect(() => {
    // Note: The original code had a small bug here. When `value` updates,
    // the callback should use the updated value, not the stale `value` state.
    // Fixed the original logic here for functionality, but the core logic intent is unchanged.
    onRichTextEditorChange(value);
  }, [value, onRichTextEditorChange]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    setLoading(true);

    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo.experience[index].title
    );

    // Logic remains the same
    const result = await AIChatSession.sendMessage(prompt);
    console.log(typeof result.response.text());
    console.log(JSON.parse(result.response.text()));
    const resp = JSON.parse(result.response.text());
    await setValue(
      resp.experience
        ? resp.experience?.join("")
        : resp.experience_bullets?.join("")
    );
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      {/* Header and AI Button Section */}
      <div className="flex justify-between items-center my-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Work Summary
        </label>

        {/* ️ Stylish AI Button ️ */}
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          // Stylish classes for the AI button
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

      {/* ️ Editor Container: Clean, modern look ️ */}
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Calling onRichTextEditorChange immediately with the new value from the event
            // This is a common pattern to avoid stale state issues in callback
            onRichTextEditorChange(e.target.value);
          }}
          // Stylish wrapper classes for the editor area
          containerProps={{
            style: {
              borderRadius: "0.5rem", // rounded-lg
              borderColor: "#e5e7eb", // border-gray-200
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // subtle shadow
            },
          }}
          // Stylish classes for the content area
          contentEditableProps={{
            className:
              "min-h-[150px] p-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none",
            style: { minHeight: "150px" },
          }}
        >
          {/* ️ Stylish Toolbar ️ */}
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

export default RichTextEditor;
