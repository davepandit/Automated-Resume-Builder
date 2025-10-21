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
    if (errors.length === 0 && educationalList.length > 0) {
      setErrors(educationalList.map(() => ({})));
    }
  }, [educationalList, dispatch]);

  const AddNewEducation = () => {
    setEducationalList([...educationalList, { ...formFields }]);
    setErrors([...errors, {}]);
  };

  const RemoveEducation = () => {
    if (educationalList.length <= 1) {
      toast.warning("At least one education entry is required.");
      return;
    }
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

  // --- VALIDATION LOGIC IS FIXED & ENHANCED ---
  const validateEducation = () => {
    const today = new Date();
    const newErrors = educationalList.map((edu) => {
      const eduErrors = {};
      const gradeValue = parseFloat(edu.grade);

      // --- Required Fields ---
      if (!edu.universityName?.trim())
        eduErrors.universityName = "University Name is required.";
      if (!edu.degree?.trim()) eduErrors.degree = "Degree is required.";
      if (!edu.major?.trim()) eduErrors.major = "Major is required.";
      if (!edu.grade?.trim()) eduErrors.grade = "Grade is required.";
      if (!edu.gradeType?.trim())
        eduErrors.gradeType = "Grade Type is required.";
      if (!edu.startDate) eduErrors.startDate = "Start Date is required.";
      if (!edu.endDate) eduErrors.endDate = "End Date is required.";

      // --- Date Validation ---
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

      // --- Grade Validation (FIXED) ---
      if (!isNaN(gradeValue)) {
        if (edu.gradeType === "CGPA" && (gradeValue < 0 || gradeValue > 10)) {
          eduErrors.grade = "CGPA must be a number between 0 and 10.";
        } else if (
          edu.gradeType === "GPA" &&
          (gradeValue < 0 || gradeValue > 4)
        ) {
          eduErrors.grade = "GPA must be a number between 0 and 4.0.";
        } else if (
          edu.gradeType === "Percentage" &&
          (gradeValue < 0 || gradeValue > 100)
        ) {
          eduErrors.grade = "Percentage must be a number between 0 and 100.";
        }
      } else if (edu.grade?.trim() && !eduErrors.grade) {
        eduErrors.grade = "Grade must be a valid number.";
      }

      return eduErrors;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const onSave = () => {
    if (!validateEducation()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setLoading(true);
    const data = { data: { education: educationalList } };

    if (resume_id) {
      console.log("Started Updating Education");
      updateThisResume(resume_id, data)
        .then(() => toast.success("Education details saved successfully!"))
        .catch((error) =>
          toast.error("Error updating resume", `${error.message}`)
        )
        .finally(() => setLoading(false));
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
          Education
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add details of your degrees, schools, and grades.
        </p>
      </div>

      {/* Education List */}
      <div>
        {educationalList.map((item, index) => (
          <div
            key={index}
            className="p-5 my-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300 bg-white dark:bg-gray-900"
          >
            <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-4">
              Education #{index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* University Name */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  University Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="universityName"
                  value={item.universityName}
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.universityName)}
                />
                {errors[index]?.universityName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].universityName}
                  </p>
                )}
              </div>

              {/* Degree */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Degree <span className="text-red-500">*</span>
                </label>
                <Input
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.degree)}
                />
                {errors[index]?.degree && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].degree}
                  </p>
                )}
              </div>

              {/* Major */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Major <span className="text-red-500">*</span>
                </label>
                <Input
                  name="major"
                  value={item.major}
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.major)}
                />
                {errors[index]?.major && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].major}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.startDate)}
                />
                {errors[index]?.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => handleChange(e, index)}
                  className={getInputBorderClass(errors[index]?.endDate)}
                />
                {errors[index]?.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].endDate}
                  </p>
                )}
              </div>

              {/* Grade */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Grade <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* Select Dropdown (Styled to look like an input) */}
                  <select
                    name="gradeType"
                    className="h-10 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    value={item.gradeType}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                  {/* Grade Input */}
                  <Input
                    type="text"
                    name="grade"
                    value={item.grade}
                    onChange={(e) => handleChange(e, index)}
                    placeholder={
                      item.gradeType === "CGPA"
                        ? "e.g., 9.2"
                        : item.gradeType === "GPA"
                        ? "e.g., 3.8"
                        : "e.g., 85"
                    }
                    className={getInputBorderClass(errors[index]?.grade)}
                  />
                </div>
                {errors[index]?.grade && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].grade}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Description (Optional)
                </label>
                <Textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Summarize key achievements or coursework (e.g., Dean's List, relevant projects)."
                  className={`min-h-[80px] ${getInputBorderClass(
                    errors[index]?.description
                  )}`}
                />
                {errors[index]?.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[index].description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex gap-3">
          {/* Add Button */}
          <Button
            variant="outline"
            onClick={AddNewEducation}
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 transition duration-200"
          >
            + Add Education
          </Button>
          {/* Remove Button */}
          <Button
            variant="outline"
            onClick={RemoveEducation}
            className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-gray-700 transition duration-200"
          >
            - Remove
          </Button>
        </div>

        {/* Save Button */}
        <Button
          disabled={loading}
          onClick={onSave}
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

export default Education;
