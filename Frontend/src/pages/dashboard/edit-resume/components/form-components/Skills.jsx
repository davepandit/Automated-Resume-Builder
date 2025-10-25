import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function Skills({ resumeInfo, enanbledNext }) {
  const [loading, setLoading] = React.useState(false);
  const [skillsList, setSkillsList] = React.useState(
    resumeInfo?.skills || [
      {
        name: "",
        rating: 0,
      },
    ]
  );
  // Initialize errors array to match skillsList length
  const [errors, setErrors] = React.useState(skillsList.map(() => ""));
  const dispatch = useDispatch();
  const { resume_id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, skills: skillsList }));
    } catch (error) {
      console.log("error in experience context update", error);
    }
    // Initialize errors array if needed
    if (errors.length === 0 && skillsList.length > 0) {
      setErrors(skillsList.map(() => ""));
    }
  }, [skillsList, dispatch]);

  const AddNewSkills = () => {
    const list = [...skillsList];
    const errList = [...errors];
    list.push({ name: "", rating: 0 });
    errList.push("");
    setSkillsList(list);
    setErrors(errList);
  };

  const RemoveSkills = () => {
    if (skillsList.length <= 1) {
      toast.warning("At least one skill entry is required.");
      return;
    }
    const list = [...skillsList];
    const errList = [...errors];
    list.pop();
    errList.pop();
    setSkillsList(list);
    setErrors(errList);
  };

  const handleChange = (index, key, value) => {
    const list = [...skillsList];
    const newListData = {
      ...list[index],
      [key]: value,
    };
    list[index] = newListData;
    setSkillsList(list);

    // Clear or set error when user interacts
    if (key === "name") {
      const newErrors = [...errors];
      newErrors[index] = value.trim() ? "" : "Skill name is required.";
      setErrors(newErrors);
    }
  };

  const onSave = () => {
    setLoading(true);

    // Validate all skill names before saving
    const newErrors = skillsList.map((skill) =>
      skill.name.trim() ? "" : "Skill name is required."
    );

    // If any error exists, stop saving
    const hasError = newErrors.some((msg) => msg !== "");
    if (hasError) {
      setErrors(newErrors);
      toast.error("Please fill all skill names before saving.");
      setLoading(false);
      return;
    }

    const data = {
      data: {
        skills: skillsList,
      },
    };

    if (resume_id) {
      console.log("Started Updating Skills");
      updateThisResume(resume_id, data)
        .then(() => {
          toast.success("Skills updated successfully!");
          // ️ Re-enable navigation buttons ️
          enanbledNext && enanbledNext(true);
        })
        .catch((error) => {
          toast.error("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleFinish = () => {
    // Navigate to the dashboard upon clicking Finish
    navigate("/dashboard");
  };

  // Helper to apply error styling to inputs
  const getInputBorderClass = (fieldError) =>
    fieldError
      ? "border-red-500 focus:border-red-600"
      : "border-gray-300 focus:border-indigo-500";

  return (
    // ️ Stylish Container ️
    <div className="p-6 shadow-xl rounded-xl border-t-indigo-600 border-t-4 bg-white dark:bg-gray-800 mt-10 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">
          Skills
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your top professional key skills and rate your proficiency.
        </p>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm gap-4"
          >
            {/* Skill Name Input */}
            <div className="w-full sm:w-1/2 space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Name <span className="text-red-500">*</span>
              </label>
              <Input
                className={getInputBorderClass(errors[index])}
                defaultValue={item.name}
                placeholder="Ex: React, PostgreSQL, Figma"
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              {errors[index] && (
                <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
              )}
            </div>

            {/* Rating Component */}
            <div className="flex flex-col items-start sm:items-center w-full sm:w-auto mt-2 sm:mt-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:hidden">
                Proficiency
              </label>
              <Rating
                className="[&>div>svg]:!fill-indigo-500 [&>div>svg]:!w-6 [&>div>svg]:!h-6"
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v) => handleChange(index, "rating", v)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons (Footer) */}
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex gap-3">
          {/* Add Skill Button */}
          <Button
            variant="outline"
            onClick={AddNewSkills}
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 transition duration-200"
          >
            + Add More Skill
          </Button>
          {/* Remove Button */}
          <Button
            variant="outline"
            onClick={RemoveSkills}
            className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-gray-700 transition duration-200"
          >
            - Remove
          </Button>
        </div>

        {/* Save & Finish Buttons */}
        <div className="flex gap-3">
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

          {/* ️ FINISH BUTTON ️ */}
          <Button
            onClick={handleFinish}
            // Use a secondary, but still professional, style
            variant="outline"
            className="text-gray-700 border-gray-400 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Skills;
