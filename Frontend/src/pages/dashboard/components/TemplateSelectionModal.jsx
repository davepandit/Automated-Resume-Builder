import React from "react";

// Define the structure for your templates
const templateOptions = [
  {
    id: "first-template",
    name: "first-template",
    image: "/heroSnapshot.png", // Replace with your actual image path
  },
  {
    id: "second-template",
    name: "second-template",
    image: "/heroSnapshot.png", // Replace with your actual image path
  },
  {
    id: "third-template",
    name: "third-template",
    image: "/heroSnapshot.png", // Replace with your actual image path
  },
  {
    id: "fourth-template",
    name: "fourth-template",
    image: "/heroSnapshot.png", // Replace with your actual image path
  },
];

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSelectTemplate,
  selectedTemplate,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    // Modal Backdrop/Overlay (Fixed position to cover the whole screen)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Choose a Resume Template 
        </h2>

        <p className="text-gray-600 mb-8">
          Select a template to start building your resume. You can change it
          later!
        </p>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templateOptions.map((template) => (
            // Template Card
            <div
              key={template.id}
              className={`
                border-4 rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out
                ${
                  selectedTemplate === template.id
                    ? "border-indigo-600 ring-4 ring-indigo-300 scale-[1.03]" // Selected style
                    : "border-gray-200 hover:border-indigo-400 hover:shadow-xl" // Default/Hover style
                }
              `}
              onClick={() => onSelectTemplate(template.id)}
            >
              {/* Template Image (The "decently big preview card" part) */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                {/* Use an image of a full resume preview. 
                  The aspect ratio of 3/4 mimics a standard portrait document.
                */}
                <img
                  src={template.image}
                  alt={`${template.name} Template Preview`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Template Name and Selection Indicator */}
              <div className="p-4 flex justify-between items-center bg-gray-50 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-700">
                  {template.name}
                </span>
                {selectedTemplate === template.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 flex justify-end gap-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm} // Closing the modal proceeds to editing with the selected template
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition duration-150"
            disabled={!selectedTemplate}
          >
            Use Selected Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionModal;
