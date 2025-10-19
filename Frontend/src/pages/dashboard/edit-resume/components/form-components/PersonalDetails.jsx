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
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
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

  const handleInputChange = (e) => {
    enanbledNext(false);
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
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    // Job Title
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required.";
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits.";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    } else {
      newErrors.email = ""; // clear the error if valid
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Personal Details Save Started");

    const form = e.target;
    const newErrors = {};
    let valid = true;

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
      return; // ⛔ stop here, do not save
    }

    // --- If valid, proceed to save ---
    const data = {
      data: { firstName, lastName, jobTitle, address, phone, email },
    };

    if (resume_id) {
      try {
        const response = await updateThisResume(resume_id, data);
        toast("Resume Updated", "success");
      } catch (error) {
        toast(error.message, "failed");
        console.log(error.message);
      } finally {
        enanbledNext(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave} noValidate>
        <div className="grid grid-cols-2 mt-5 gap-3">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="firstName"
              defaultValue={resumeInfo?.firstName}
              required
              onChange={handleInputChange}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="lastName"
              defaultValue={resumeInfo?.lastName}
              required
              onChange={handleInputChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="col-span-2">
            <label className="text-sm font-medium">
              Job Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="jobTitle"
              defaultValue={resumeInfo?.jobTitle}
              required
              onChange={handleInputChange}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm">{errors.jobTitle}</p>
            )}
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label className="text-sm font-medium">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              name="address"
              defaultValue={resumeInfo?.address}
              required
              onChange={handleInputChange}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">
              Phone <span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              defaultValue={resumeInfo?.phone}
              required
              onChange={handleInputChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              name="email"
              defaultValue={resumeInfo?.email}
              required
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
