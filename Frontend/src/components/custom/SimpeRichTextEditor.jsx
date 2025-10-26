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

// --- PERFECTED PROJECT PROMPT CONSTANT ---
const PROMPT = `As an expert resume writer, your task is to synthesize the following user input to generate professional, high-impact, achievement-oriented bullet points for a project description.

INPUT DATA:
- Project Name: "{projectName}"
- Tech Stack: "{techStack}"
- User-Provided Summary: "{userSummaryText}"

You must adhere to the following strict requirements:
1. Output Format: Respond ONLY with a single, un-wrapped JSON object (no markdown fences or explanatory text).
2. JSON Schema: The object MUST contain three fields: "projectName" (string), "techStack" (string), and "projectSummary" (string[] - must be an array of 4 to 5 bullet point strings).

3. Content Constraints:
 - The bullet points must be **extremely relevant, achievement-oriented, and directly based on the provided user summary.**
 - Generate a total of **4 to 5** concise, action-oriented bullet points.
 - Every bullet point string MUST be wrapped in an **HTML <li> and </li> tag** (e.g., "<li>Developed a full-stack application using Next.js...</li>").`;
// -----------------------------------------

function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value, onRichTextEditorChange]);

  const GenerateSummaryFromAI = async () => {
    // --- LOGIC REVERTED: ONLY checking for Project Name and Tech Stack ---
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true); // --- Updated Prompt Construction (Essential for Relevance) ---

    const projectData = resumeInfo?.projects[index]; // Use the current editor value for the summary text, falling back to an empty string if null
    const userSummaryText = value || "";
    const prompt = PROMPT.replace("{projectName}", projectData.projectName)
      .replace("{techStack}", projectData.techStack)
      .replace("{userSummaryText}", userSummaryText); // Injecting the user's detailed summary text //
    console.log("Prompt:", prompt);
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = result.response.text(); // --- Robust JSON Extraction Logic ---
      console.log("--- Raw AI Response ---");
      console.log(responseText);

      let jsonString = responseText.trim(); // Regex to capture content inside ```json...``` or just ```...```
      const jsonMatch = responseText.match(
        /```json\n([\s\S]*?)\n```|```([\s\S]*?)```/
      );
      if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
        jsonString = (jsonMatch[1] || jsonMatch[2]).trim();
      } else if (jsonString.startsWith("```")) {
        // Fallback for raw backtick wrapping
        jsonString = jsonString.replace(/^```[a-zA-Z]*\s*|\s*```$/g, "").trim();
      } // ------------------------------------
      const resp = JSON.parse(jsonString);
      console.log("Parsed Response:", resp); // Use the 'projectSummary' field and join/wrap in <ul> tags

      const experienceArray = resp.projectSummary || [];
      const summaryHtml = `<ul>${experienceArray.join("")}</ul>`;

      setValue(summaryHtml);
      toast.success("Project summary generated successfully!");
    } catch (error) {
      toast.error("Failed to parse AI response. Check console for raw output.");
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
          Summary{" "}
        </label>
        {/*  Stylish AI Button  */}{" "}
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading} // Stylish classes: Indigo accent, shadow, transition
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
              <Sparkles className="h-4 w-4 fill-indigo-500 text-indigo-500" />{" "}
              Generate from AI{" "}
            </>
          )}{" "}
        </Button>{" "}
      </div>
      {/* ️ Editor Container: Clean, modern look ️ */}{" "}
      <EditorProvider>
        {" "}
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value); // Calling the callback with the new event value
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
          {/* ️ Stylish Toolbar ️ */}{" "}
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

export default SimpeRichTextEditor;
