import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
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
  const [errors, setErrors] = React.useState([]); // ✅ added for skill name validation
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, skills: skillsList }));
    } catch (error) {
      console.log("error in experience context update", error);
    }
  }, [skillsList]);

  const AddNewSkills = () => {
    const list = [...skillsList];
    list.push({ name: "", rating: 0 });
    setSkillsList(list);
    setErrors((prev) => [...prev, ""]); // ✅ maintain parallel error array
  };

  const RemoveSkills = () => {
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

    // ✅ clear error when user types a valid name
    if (key === "name") {
      const newErrors = [...errors];
      newErrors[index] = value.trim() ? "" : "Skill name is required.";
      setErrors(newErrors);
    }
  };

  const onSave = () => {
    setLoading(true);

    // ✅ validate all skill names before saving
    const newErrors = skillsList.map((skill) =>
      skill.name.trim() ? "" : "Skill name is required."
    );

    // If any error exists, stop saving
    const hasError = newErrors.some((msg) => msg !== "");
    if (hasError) {
      setErrors(newErrors);
      toast("Please fill all skill names before saving.", "error");
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
          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between mb-2 border rounded-lg p-3 flex-col sm:flex-row gap-3"
          >
            <div className="w-full sm:w-1/2">
              <label className="text-xs font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                className={`w-full ${errors[index] ? "border-red-500" : ""}`}
                defaultValue={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              {errors[index] && (
                <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v) => handleChange(index, "rating", v)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewSkills}
            className="text-primary"
          >
            + Add More Skill
          </Button>
          <Button
            variant="outline"
            onClick={RemoveSkills}
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

export default Skills;
