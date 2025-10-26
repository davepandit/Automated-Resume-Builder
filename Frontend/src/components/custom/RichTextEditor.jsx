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

// --- PERFECT WORK EXPERIENCE PROMPT CONSTANT ---
const PROMPT = `As an expert resume writer, your task is to synthesize the following user input to generate professional, high-impact, achievement-oriented bullet points for a Work Experience summary.

INPUT DATA:
- Position Title: "{positionTitle}"
- Company Name: "{companyName}"
- Work Summary (User Description): "{workSummaryText}"

You must adhere to the following strict requirements:
1. Output Format: Respond ONLY with a single, un-wrapped JSON object (no markdown fences like \`\`\`json or any explanatory text).
2. JSON Schema: The object MUST contain two fields:
  "positionTitle": string (must echo the input position title).
  "experience": string[] (must be an array containing 4 to 5 bullet point strings).

3. Content Constraints:
  - The content must be **extremely relevant, achievement-oriented, and directly based on the provided user summary and job context (Title/Company).**
  - Generate a total of **4 to 5** concise, action-oriented bullet points.
  - Every bullet point string MUST be wrapped in an **HTML <li> and </li> tag** (e.g., "<li>Developed and maintained core features for a high-traffic web application...</li>").`;
// --------------------------------------------------

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  // State holds the content of the rich text editor (the Work Summary)
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false); // Passes the current value back to the parent component whenever 'value' changes

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value, onRichTextEditorChange]);

  const GenerateSummaryFromAI = async () => {
    // Safely retrieve the inputs, checking for common naming conventions (e.g., 'title' vs 'positionTitle')
    const positionTitle =
      resumeInfo?.experience[index]?.positionTitle ||
      resumeInfo?.experience[index]?.title;
    const companyName =
      resumeInfo?.experience[index]?.companyName ||
      resumeInfo?.experience[index]?.company;
    const workSummaryText = value; // The user's detailed summary text // Validation Check (Reverted to only check Title and Company Name to fix the recurring toast issue)

    if (!positionTitle || !companyName) {
      toast("Add Position Title and Company Name to generate summary");
      return;
    }
    setLoading(true); // --- Prompt Construction: Injects all three pieces of data ---

    const prompt = PROMPT.replace("{positionTitle}", positionTitle)
      .replace("{companyName}", companyName)
      .replace("{workSummaryText}", workSummaryText); // -------------------------------------------------------------
    console.log("Prompt", prompt);
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text(); // --- Robust JSON Extraction Logic (Essential for stable AI generation) ---
      console.log("--- Raw AI Response ---");
      console.log(responseText);

      let jsonString = responseText.trim(); // Regex to find content inside ```json ... ``` or just ``` ... ```
      const jsonMatch = responseText.match(
        /```json\n([\s\S]*?)\n```|```([\s\S]*?)```/
      );
      if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
        jsonString = (jsonMatch[1] || jsonMatch[2]).trim();
      } else if (jsonString.startsWith("```")) {
        // Fallback to strip initial/trailing backticks if regex didn't catch it
        jsonString = jsonString.replace(/^```[a-zA-Z]*\s*|\s*```$/g, "").trim();
      } // --------------------------------------------------------------------------
      const resp = JSON.parse(jsonString);
      console.log("Parsed Response:", resp); // Use the 'experience' field and wrap the array of <li> strings in <ul> tags

      const experienceArray = resp.experience || [];
      const summaryHtml = `<ul>${experienceArray.join("")}</ul>`;

      setValue(summaryHtml);
      toast.success("Work summary generated successfully!");
    } catch (error) {
      toast.error(
        "Failed to generate summary. Please ensure inputs are clear and try again."
      );
      console.error("AI Generation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header and AI Button Section */}{" "}
      <div className="flex justify-between items-center my-2">
        {" "}
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Work Summary{" "}
        </label>
        {/*  Stylish AI Button  */}{" "}
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading} // Stylish classes for the AI button
          className="flex items-center gap-2 text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-800 transition duration-200 shadow-sm"
        >
          {" "}
          {loading ? (
            <>
              <LoaderCircle className="animate-spin w-4 h-4" />
              Generating...{" "}
            </>
          ) : (
            <>
              {" "}
              <Sparkles className="h-4 w-4 fill-indigo-500 text-indigo-500" />
              Generate from AI{" "}
            </>
          )}{" "}
        </Button>{" "}
      </div>
      {/* Editor Container: Clean, modern look */}{" "}
      <EditorProvider>
        {" "}
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value); // Calling onRichTextEditorChange immediately with the new value from the event
            onRichTextEditorChange(e.target.value);
          }} // Stylish wrapper classes for the editor area
          containerProps={{
            style: {
              borderRadius: "0.5rem", // rounded-lg
              borderColor: "#d1d5db", // border-gray-300
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // subtle shadow
              borderWidth: "1px", // ensures visible border
            },
          }} // Stylish classes for the content area
          contentEditableProps={{
            className:
              "min-h-[150px] p-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none",
            style: { minHeight: "150px" },
          }}
        >
          {/* Stylish Toolbar */}{" "}
          <Toolbar className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg border-b border-gray-200 dark:border-gray-600 space-x-1">
            {" "}
            <BtnBold className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
            <BtnItalic className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
            <BtnUnderline className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
            <BtnStrikeThrough className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
            <Separator className="border-gray-300 dark:border-gray-500" />{" "}
            <BtnNumberedList className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
            <BtnBulletList className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
            <Separator className="border-gray-300 dark:border-gray-500" />{" "}
            <BtnLink className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition" />{" "}
          </Toolbar>{" "}
        </Editor>{" "}
      </EditorProvider>{" "}
    </div>
  );
}

export default RichTextEditor;
