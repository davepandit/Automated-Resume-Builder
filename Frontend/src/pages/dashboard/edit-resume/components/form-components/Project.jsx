import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(
    resumeInfo?.projects && resumeInfo.projects.length > 0
      ? resumeInfo.projects
      : [{ ...formFields }]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(projectList.map(() => ({})));
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
    if (errors.length === 0 && projectList.length > 0) {
      setErrors(projectList.map(() => ({})));
    }
  }, [projectList, dispatch]);

  const addProject = () => {
    setProjectList([...projectList, { ...formFields }]);
    setErrors([...errors, {}]);
  };

  const removeProject = (index) => {
    if (projectList.length <= 1) {
      toast.warning("At least one project entry is required.");
      return;
    }
    const newList = projectList.filter((_, i) => i !== index);
    setProjectList(newList);

    const newErrors = errors.filter((_, i) => i !== index);
    setErrors(newErrors);
  };

  const handleChange = (e, index) => {
    setEnabledNext && setEnabledNext(false);
    setEnabledPrev && setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...projectList];
    list[index] = { ...list[index], [name]: value };
    setProjectList(list);

    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index], [name]: "" };
    setErrors(newErrors);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...projectList];
    list[index] = { ...list[index], [name]: value };
    setProjectList(list);

    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index], [name]: "" };
    setErrors(newErrors);
  };

  const validateProjects = () => {
    const newErrors = projectList.map((project) => {
      const projectErrors = {};

      // Check Project Name and Tech Stack existence
      if (!project.projectName?.trim())
        projectErrors.projectName = "Project Name is required.";

      if (!project.techStack?.trim())
        projectErrors.techStack = "Tech Stack is required.";

      // ⭐️ FIXED: Rely ONLY on the cleaned text check for the summary field ⭐️
      const summaryText = project.projectSummary
        ?.replace(/<[^>]*>/g, "")
        .trim();
      if (!summaryText || summaryText.length < 5)
        projectErrors.projectSummary =
          "Project Summary is required (min 5 characters).";

      return projectErrors;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const onSave = () => {
    if (!validateProjects()) {
      toast.error("Please fill all required project fields correctly.");
      setEnabledNext && setEnabledNext(true);
      setEnabledPrev && setEnabledPrev(true);
      return;
    }

    setLoading(true);
    const data = { data: { projects: projectList } };

    if (resume_id) {
      console.log("Started Updating Project");
      updateThisResume(resume_id, data)
        .then(() => toast.success("Project details saved successfully!"))
        .catch((error) =>
          toast.error("Error updating resume", `${error.message}`)
        )
        .finally(() => {
          setEnabledNext && setEnabledNext(true);
          setEnabledPrev && setEnabledPrev(true);
          setLoading(false);
        });
    } else {
      setEnabledNext && setEnabledNext(true);
      setEnabledPrev && setEnabledPrev(true);
      setLoading(false);
      toast.warning("Cannot save: Resume ID is missing.");
    }
  };

  // Helper to apply error styling to inputs
  const getInputBorderClass = (fieldError) =>
    fieldError
      ? "border-red-500 focus:border-red-600"
      : "border-gray-300 focus:border-indigo-500";

  return (
    // ⭐️ Stylish Container ⭐️
    <div className="p-6 shadow-xl rounded-xl border-t-indigo-600 border-t-4 bg-white dark:bg-gray-800 mt-10 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">
          Projects
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Showcase your best personal or professional projects.
        </p>
      </div>

      {/* Project List */}
      <div>
        {projectList?.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between items-center my-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-xl text-indigo-600 dark:text-indigo-400">
                Project {index + 1}
              </h3>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-gray-700 transition duration-200"
                onClick={() => removeProject(index)}
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {/* Project Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName}
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.projectName)}
                />
                {errors[index]?.projectName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].projectName}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack}
                  placeholder="React, Node.js, Express, MongoDB"
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.techStack)}
                />
                {errors[index]?.techStack && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].techStack}
                  </p>
                )}
              </div>

              {/* Project Summary */}
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Summary <span className="text-red-500">*</span>
                </label>
                <SimpeRichTextEditor
                  index={index}
                  resumeInfo={resumeInfo}
                  defaultValue={project?.projectSummary}
                  onRichTextEditorChange={(value) =>
                    handleRichTextEditor(value, "projectSummary", index)
                  }
                />
                {errors[index]?.projectSummary && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].projectSummary}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons (Footer) */}
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex gap-3">
          {/* Add Project Button */}
          <Button
            variant="outline"
            onClick={addProject}
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 transition duration-200"
          >
            + Add Project
          </Button>
        </div>

        {/* Save Button */}
        <Button
          disabled={loading}
          onClick={onSave}
          // Primary Indigo button
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:bg-indigo-400/50"
        >
          {loading ? (
            <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Project;
