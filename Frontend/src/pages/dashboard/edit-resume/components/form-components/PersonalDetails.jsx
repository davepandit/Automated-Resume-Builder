import React from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
  });

  // state to display the errors
  const [errors, setErrors] = React.useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
  });

  // helper to apply error styling to inputs
  const getInputBorderClass = (fieldName) =>
    errors[fieldName]
      ? "border-red-500 focus:border-red-600"
      : "border-gray-300 focus:border-indigo-500";

  const handleInputChange = (e) => {
    enanbledNext && enanbledNext(false);

    // dispatch and update formData state
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear the error for the field being typed
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // --- VALIDATION LOGIC IS PRESERVED AND USED ---
  const validateForm = () => {
    // this function is defined but not called in the final submission.
    // the validation inside onSave is the active logic.
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.jobTitle.trim())
      newErrors.jobTitle = "Job title is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits.";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Personal Details Save Started");

    const form = e.target;
    const newErrors = {};
    let valid = true;

    // retrieve and trim values directly from the form for final validation
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const jobTitle = form.jobTitle.value.trim();
    const address = form.address.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();

    // --- First Name Validation ---
    if (!firstName) {
      newErrors.firstName = "First name is required.";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
      newErrors.firstName = "First name can only contain letters and spaces.";
      valid = false;
    }

    // --- Last Name Validation ---
    if (!lastName) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces.";
      valid = false;
    }

    // --- Job Title Validation ---
    if (!jobTitle) {
      newErrors.jobTitle = "Job title is required.";
      valid = false;
    } else if (jobTitle.length < 2) {
      newErrors.jobTitle = "Job title must be at least 2 characters.";
      valid = false;
    }

    // --- Address Validation ---
    if (!address) {
      newErrors.address = "Address is required.";
      valid = false;
    } else if (address.length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
      valid = false;
    }

    // --- Phone Validation ---
    if (!phone) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    } else if (!/^\+?\d{10,15}$/.test(phone)) {
      newErrors.phone = "Enter a valid phone number (10–15 digits).";
      valid = false;
    }

    // --- Email Validation ---
    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // --- Stop submission if invalid ---
    if (!valid) {
      setErrors(newErrors);
      setLoading(false);
      toast.error("Please correct the errors in the form.");
      return; // stop here, do not save
    }

    // --- If valid, proceed to save ---
    const data = {
      data: { firstName, lastName, jobTitle, address, phone, email },
    };

    if (resume_id) {
      try {
        await updateThisResume(resume_id, data);
        toast.success("Personal Details saved successfully!");
      } catch (error) {
        toast.error("Error updating resume", `${error.message}`);
        console.log(error.message);
      } finally {
        enanbledNext && enanbledNext(true);
        setLoading(false);
      }
    }
  };

  return (
    // stylish container
    <div className="p-6 shadow-xl rounded-xl border-t-indigo-600 border-t-4 bg-white dark:bg-gray-800 mt-10 space-y-6">
      <div className="space-y-1">
        <h2 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">
          Personal Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get Started with the basic information needed for your resume.
        </p>
      </div>

      <form onSubmit={onSave} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* first name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="firstName"
              defaultValue={resumeInfo?.firstName}
              required
              onChange={handleInputChange}
              className={getInputBorderClass("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* last name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="lastName"
              defaultValue={resumeInfo?.lastName}
              required
              onChange={handleInputChange}
              className={getInputBorderClass("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* job title */}
          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="jobTitle"
              defaultValue={resumeInfo?.jobTitle}
              required
              onChange={handleInputChange}
              className={getInputBorderClass("jobTitle")}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
            )}
          </div>

          {/* address */}
          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              name="address"
              defaultValue={resumeInfo?.address}
              required
              onChange={handleInputChange}
              className={getInputBorderClass("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone <span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              defaultValue={resumeInfo?.phone}
              required
              onChange={handleInputChange}
              className={getInputBorderClass("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              name="email"
              defaultValue={resumeInfo?.email}
              required
              onChange={handleInputChange}
              className={getInputBorderClass("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* save button */}
        <div className="mt-6 flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:bg-indigo-400/50"
          >
            {loading ? (
              <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
