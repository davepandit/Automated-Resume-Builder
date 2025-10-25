import { FaEye, FaEdit, FaTrashAlt, FaBook, FaSpinner } from "react-icons/fa";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Retained existing vibrant gradients but filtered color combinations in the list.
const gradients = [
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-blue-400 via-fuchsia-500 to-indigo-600",
  "from-cyan-400 via-blue-500 to-purple-600",
  "from-amber-500 via-orange-600 to-fuchsia-500",
  "from-blue-500 via-sky-400 to-indigo-300",
];

const getRandomGradient = () => {
  return gradients[Math.floor(Math.random() * gradients.length)];
};

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  const gradient = React.useMemo(() => getRandomGradient(), []);
  const navigate = useNavigate();

  // Primary action for clicking the card body
  const handleEditClick = () => {
    navigate(`/dashboard/edit-resume/${resume._id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    console.log("Delete Resume with ID", resume._id);
    try {
      await deleteThisResume(resume._id);
      toast.success("Resume deleted successfully!");
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast.error(error.message || "Failed to delete resume.");
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  const ResumePlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-white/90">
      <FaBook className="w-16 h-16 opacity-75 drop-shadow-md" />
      <p className="mt-4 text-sm font-light text-white/70">
        Last Updated:{" "}
        {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div
      className={`relative p-0 h-[380px] rounded-2xl shadow-xl transition-all duration-500 ease-in-out group 
                  hover:scale-[1.03] hover:shadow-2xl overflow-hidden 
                  bg-gray-950 border border-gray-800`}
    >
      {/* ⭐️ Top Section: Clickable Resume Area (Edit Trigger) ⭐️ */}
      <div
        // Applies primary navigation here
        onClick={handleEditClick}
        className={`w-full h-full p-6 bg-gradient-to-br ${gradient} rounded-2xl flex flex-col justify-between absolute inset-0 cursor-pointer`}
      >
        {/* Title Display */}
        <div className="flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-lg shadow-inner border border-white/30 transform transition duration-300 group-hover:scale-[0.98]">
          <h2
            className={`text-center font-extrabold text-xl mx-2 bg-clip-text text-white drop-shadow-sm`}
          >
            {resume.title}
          </h2>
        </div>

        {/* Placeholder Icon */}
        <div className="flex-grow flex items-center justify-center h-full pt-4">
          <ResumePlaceholder />
        </div>
      </div>

      {/* ⭐️ Bottom Section: Action Bar (z-20 to ensure buttons are clickable) ⭐️ */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-around p-3 bg-white/95 rounded-b-2xl shadow-lg border-t border-gray-100 z-20 
                    dark:bg-gray-800/95 dark:border-gray-700 
                    transform translate-y-full opacity-0 
                    group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out"
      >
        {/* View Button */}
        <Button
          variant="ghost"
          // FIX 1: Stop propagation so only this button's navigate runs, not the card's
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/view-resume/${resume._id}`);
          }}
          className="p-2 w-1/3 transition duration-300 ease-in-out hover:bg-indigo-50/50 dark:hover:bg-gray-700"
        >
          <FaEye className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />{" "}
          View
        </Button>

        {/* Edit Button (Secondary Trigger) */}
        <Button
          variant="ghost"
          // FIX 2: Stop propagation so only this button's navigate runs, not the card's
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/edit-resume/${resume._id}`);
          }}
          className="p-2 w-1/3 transition duration-300 ease-in-out hover:bg-purple-50/50 dark:hover:bg-gray-700"
        >
          <FaEdit className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />{" "}
          Edit
        </Button>

        {/* Delete Button (Warning Action - Amber/Orange) */}
        <Button
          variant="ghost"
          // FIX 3: Stop propagation so only this button's action runs
          onClick={(e) => {
            e.stopPropagation();
            setOpenAlert(true);
          }}
          className="p-2 w-1/3 transition duration-300 ease-in-out hover:bg-amber-50/50 dark:hover:bg-gray-700"
        >
          <FaTrashAlt className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />{" "}
          Delete
        </Button>

        {/* Alert Dialog (Amber accents) */}
        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-amber-600">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                This action cannot be undone. This will permanently delete your
                **Resume** and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setOpenAlert(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={loading}
                className="bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-400/70"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCard;
