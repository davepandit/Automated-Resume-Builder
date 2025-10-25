import React from "react";
import { useState } from "react";
import { CopyPlus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume, saveTemplateChoice } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";
import TemplateSelectionModal from "./TemplateSelectionModal";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  // state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // state to choose the template
  const [template, setTemplate] = useState("first-template");
  const [newResumeId, setNewResumeId] = useState(null);
  const Navigate = useNavigate();

  const createResume = async () => {
    setLoading(true);
    if (resumetitle === "") {
      setLoading(false);
      return console.log("Please add a title to your resume");
    }
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#1e1d64ff",
      },
    };

    try {
      const res = await createNewResume(data);
      console.log("Resume Created. ID:", res.data.resume._id);

      // 1. Store the new ID
      setNewResumeId(res.data.resume._id);
      // close the resume title modal
      setOpenDialog(false);

      // 2. Open the modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error creating resume:", error);
    } finally {
      setLoading(false);
      setResumetitle("");
    }
  };

  // New function to handle the final action from the modal
  const handleFinalTemplateSelection = async () => {
    if (newResumeId && template) {
      // 1. Close the modal
      setIsModalOpen(false);

      // make a call to the database saving the template choice of the user
      const res = await saveTemplateChoice(template, newResumeId);

      // 2. Navigate with the stored ID and the selected template
      Navigate(`/dashboard/edit-resume/${newResumeId}?template=${template}`);

      // Reset the ID for next time
      setNewResumeId(null);
    }
  };

  return (
    <>
      <div
        className="p-14 py-24 flex items-center justify-center border-2 bg-secondary rounded-lg h-[380px] hover:scale-105 transition-all duration-400 cursor-pointer hover:shadow-md transform-gpu"
        onClick={() => setOpenDialog(true)}
      >
        <CopyPlus className="transition-transform duration-300" />
      </div>
      <Dialog open={isDialogOpen}>
        <DialogContent setOpenDialog={setOpenDialog}>
          <DialogHeader>
            <DialogTitle>Create a New Resume</DialogTitle>
            <DialogDescription>
              Add a title and Description to your new resume
              <Input
                className="my-3"
                type="text"
                placeholder="Ex: Backend Resume"
                value={resumetitle}
                onChange={(e) => setResumetitle(e.target.value.trimStart())}
              />
            </DialogDescription>
            <div className="gap-2 flex justify-end">
              <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createResume} disabled={!resumetitle || loading}>
                {loading ? (
                  <Loader className="color blue animate-spin" />
                ) : (
                  "Create Resume"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        // When canceling, just close the modal and reset the ID
        onClose={() => {
          setIsModalOpen(false);
          setNewResumeId(null); // Optional: clear the ID if the user cancels
        }}
        // When a card is clicked, update the template state
        onSelectTemplate={setTemplate}
        selectedTemplate={template}
        // This is the function that navigates after a template is confirmed
        onConfirm={handleFinalTemplateSelection}
      />
    </>
  );
}

export default AddResume;
