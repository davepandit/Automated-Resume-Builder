import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

function Education({ resumeInfo, enanbledNext }) {
  const [educationalList, setEducationalList] = useState(
    resumeInfo?.education || [{ ...formFields }]
  );
  const [errors, setErrors] = useState([]);
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationalList }));
  }, [educationalList]);

  const AddNewEducation = () => {
    setEducationalList([...educationalList, { ...formFields }]);
    setErrors([...errors, {}]);
  };

  const RemoveEducation = () => {
    if (educationalList.length < 1) return;
    setEducationalList(educationalList.slice(0, -1));
    setErrors(errors.slice(0, -1));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...educationalList];
    list[index] = { ...list[index], [name]: value };
    setEducationalList(list);

    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index], [name]: "" };
    setErrors(newErrors);
  };

  const validateEducation = () => {
    const today = new Date();
    const newErrors = educationalList.map((edu) => {
      const eduErrors = {};

      if (!edu.universityName?.trim())
        eduErrors.universityName = "University Name is required.";
      if (!edu.degree?.trim()) eduErrors.degree = "Degree is required.";
      if (!edu.major?.trim()) eduErrors.major = "Major is required.";
      if (!edu.grade?.trim()) eduErrors.grade = "Grade is required.";
      if (!edu.gradeType?.trim())
        eduErrors.gradeType = "Grade Type is required.";
      if (!edu.startDate) eduErrors.startDate = "Start Date is required.";
      if (!edu.endDate) eduErrors.endDate = "End Date is required.";

      if (edu.startDate) {
        const start = new Date(edu.startDate);
        if (start > today)
          eduErrors.startDate = "Start Date cannot be in the future.";
      }
      if (edu.endDate) {
        const end = new Date(edu.endDate);
        if (end > today)
          eduErrors.endDate = "End Date cannot be in the future.";
        if (edu.startDate && new Date(edu.startDate) > end)
          eduErrors.endDate = "End Date cannot be before Start Date.";
      }

      // CGPA validation if gradeType is CGPA
      if (edu.gradeType === "CGPA") {
        const cgpaValue = parseFloat(edu.grade);
        if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10)
          eduErrors.grade = "CGPA must be a number between 0 and 10.";
      }

      return eduErrors;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const onSave = () => {
    if (!validateEducation()) return;

    setLoading(true);
    const data = { data: { education: educationalList } };

    if (resume_id) {
      console.log("Started Updating Education");
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", "success"))
        .catch((error) => toast("Error updating resume", `${error.message}`))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              {/* University Name */}
              <div className="col-span-2">
                <label className="font-medium">
                  University Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="universityName"
                  value={item.universityName}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.universityName && (
                  <p className="text-red-500 text-xs">
                    {errors[index].universityName}
                  </p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label className="font-medium">
                  Degree <span className="text-red-500">*</span>
                </label>
                <Input
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.degree && (
                  <p className="text-red-500 text-xs">{errors[index].degree}</p>
                )}
              </div>

              {/* Major */}
              <div>
                <label className="font-medium">
                  Major <span className="text-red-500">*</span>
                </label>
                <Input
                  name="major"
                  value={item.major}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.major && (
                  <p className="text-red-500 text-xs">{errors[index].major}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="font-medium">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate}
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
                <label className="font-medium">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.endDate && (
                  <p className="text-red-500 text-xs">
                    {errors[index].endDate}
                  </p>
                )}
              </div>

              {/* Grade */}
              <div className="col-span-2">
                <label className="font-medium">
                  Grade <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center items-center gap-4">
                  <select
                    name="gradeType"
                    className="py-2 px-4 rounded-md"
                    value={item.gradeType}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                  <Input
                    type="text"
                    name="grade"
                    value={item.grade}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                {errors[index]?.grade && (
                  <p className="text-red-500 text-xs">{errors[index].grade}</p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="font-medium">Description</label>
                <Textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[index]?.description && (
                  <p className="text-red-500 text-xs">
                    {errors[index].description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewEducation}
            className="text-primary"
          >
            + Add More Education
          </Button>
          <Button
            variant="outline"
            onClick={RemoveEducation}
            className="text-primary"
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Education;
