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
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    setProjectList([...projectList, formFields]);
    setErrors([...errors, {}]); // Add empty error object for new project
  };

  const removeProject = (index) => {
    const list = [...projectList];
    const newList = list.filter((_, i) => i !== index);
    setProjectList(newList);

    const newErrors = [...errors].filter((_, i) => i !== index);
    setErrors(newErrors);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
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
      if (!project.projectName?.trim())
        projectErrors.projectName = "Project Name is required.";
      if (!project.techStack?.trim())
        projectErrors.techStack = "Tech Stack is required.";
      if (!project.projectSummary?.trim())
        projectErrors.projectSummary = "Project Summary is required.";
      return projectErrors;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const onSave = () => {
    if (!validateProjects()) return; // Stop save if validation fails

    setLoading(true);
    const data = { data: { projects: projectList } };
    if (resume_id) {
      console.log("Started Updating Project");
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", "success"))
        .catch((error) => toast("Error updating resume", `${error.message}`))
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Project</h2>
      <p>Add your projects</p>
      <div>
        {projectList?.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between my-2">
              <h3 className="font-bold text-lg">Project {index + 1}</h3>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => removeProject(index)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              {/* Project Name */}
              <div>
                <label className="text-xs font-medium">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.projectName && (
                  <p className="text-red-500 text-xs">
                    {errors[index].projectName}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div>
                <label className="text-xs font-medium">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack}
                  placeholder="React, Node.js, Express, MongoDB"
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.techStack && (
                  <p className="text-red-500 text-xs">
                    {errors[index].techStack}
                  </p>
                )}
              </div>

              {/* Project Summary */}
              <div className="col-span-2">
                <label className="text-xs font-medium">
                  Project Summary <span className="text-red-500">*</span>
                </label>
                <SimpeRichTextEditor
                  index={index}
                  defaultValue={project?.projectSummary}
                  onRichTextEditorChange={(event) =>
                    handleRichTextEditor(event, "projectSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
                {errors[index]?.projectSummary && (
                  <p className="text-red-500 text-xs">
                    {errors[index].projectSummary}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-2">
        <Button onClick={addProject} variant="outline" className="text-primary">
          + Add {projectList?.length > 0 ? "more" : null} project
        </Button>
        <Button onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;
