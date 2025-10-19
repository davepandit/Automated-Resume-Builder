import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    } catch (error) {
      console.log("error in experience context update", error.message);
    }
  }, [experienceList]);

  const addExperience = () => {
    if (!experienceList) {
      setExperienceList([formFields]);
      return;
    }
    setExperienceList([...experienceList, formFields]);
  };

  const removeExperience = (index) => {
    const list = [...experienceList];
    const newList = list.filter((_, i) => i !== index);
    setExperienceList(newList);
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const validateExperience = () => {
    const newErrors = experienceList.map((exp) => {
      const expErrors = {};
      const today = new Date().toISOString().split("T")[0];

      if (!exp.title.trim()) expErrors.title = "Position title is required.";
      if (!exp.companyName.trim())
        expErrors.companyName = "Company name is required.";
      if (!exp.city.trim()) expErrors.city = "City is required.";
      if (!exp.state.trim()) expErrors.state = "State is required.";

      if (!exp.startDate) expErrors.startDate = "Start date is required.";
      else if (exp.startDate > today)
        expErrors.startDate = "Start date cannot be in the future.";

      if (!exp.endDate) expErrors.endDate = "End date is required.";
      else if (exp.endDate > today)
        expErrors.endDate = "End date cannot be in the future.";

      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate)
        expErrors.endDate = "End date cannot be before start date.";

      if (!exp.workSummary?.trim())
        expErrors.workSummary = "Work summary is required.";

      return expErrors;
    });

    setErrors(newErrors);
    return newErrors.every((e) => Object.keys(e).length === 0);
  };

  const onSave = () => {
    if (!validateExperience()) return;

    setLoading(true);
    const data = { data: { experience: experienceList } };
    if (resume_id) {
      console.log("Started Updating Experience");
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", "success"))
        .catch((error) => toast("Error updating resume", `${error.message}`))
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Experience</h2>
        <p>Add Your Previous Job Experience</p>
        <div>
          {experienceList?.map((experience, index) => (
            <div key={index}>
              <div className="flex justify-between my-2">
                <h3 className="font-bold text-lg">Experience {index + 1}</h3>
                <Button
                  variant="outline"
                  className="text-red-500"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                {/* Position Title */}
                <div>
                  <label className="text-xs font-medium">
                    Position Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={experience?.title}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.title && (
                    <p className="text-red-500 text-xs">
                      {errors[index].title}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="text-xs font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="companyName"
                    value={experience?.companyName}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.companyName && (
                    <p className="text-red-500 text-xs">
                      {errors[index].companyName}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={experience?.city}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.city && (
                    <p className="text-red-500 text-xs">{errors[index].city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="text-xs font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={experience?.state}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.state && (
                    <p className="text-red-500 text-xs">
                      {errors[index].state}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-xs font-medium">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    value={experience?.startDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.startDate && (
                    <p className="text-red-500 text-xs">
                      {errors[index].startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="text-xs font-medium">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="endDate"
                    max={new Date().toISOString().split("T")[0]}
                    value={experience?.endDate}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.endDate && (
                    <p className="text-red-500 text-xs">
                      {errors[index].endDate}
                    </p>
                  )}
                </div>

                {/* Work Summary */}
                <div className="col-span-2">
                  <label className="text-xs font-medium">
                    Work Summary <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    index={index}
                    defaultValue={experience?.workSummary}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "workSummary", index)
                    }
                    resumeInfo={resumeInfo}
                  />
                  {errors[index]?.workSummary && (
                    <p className="text-red-500 text-xs">
                      {errors[index].workSummary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between py-2">
          <Button
            onClick={addExperience}
            variant="outline"
            className="text-primary"
          >
            + Add {resumeInfo?.experience?.length > 0 ? "more" : null}{" "}
            Experience
          </Button>
          <Button onClick={onSave}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
