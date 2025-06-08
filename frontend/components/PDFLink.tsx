import React from "react";
// import Button from "./Button"; // Assuming Button.tsx is in the same directory
import { FaPlus } from "react-icons/fa"; // Example icon, adjust as needed

//specify upload type type

const uploadTypeMap = {
  endsem: "End Semester",
  midsem: "Mid Semester",
  lectures: "Lectures",
  notes: "Notes",
  other: "Other",
};

export default function PDFLink({ subject, uploadtype }) {
  // Safely access the links array
  const links = subject ? subject[uploadtype] : null;
  console.log("Links:", links);

  const handleContribute = async () => {
    // ...existing code...
  };

  return (
    <div className="border-b-2 border-gray-700 py-4">
      <span>{uploadTypeMap[uploadtype] || uploadtype}: </span>
      <div
        className="text-xs text-[var(--color-3)] cursor-pointer flex items-center"
        onClick={handleContribute}
      >
        <FaPlus className="mr-1" />
        Contribute
      </div>
      <ul>
        {/* Check if links is null/undefined OR if it's an empty array */}
        {!links || links.length === 0 ? (
          <li className="text-gray-500">No links available</li>
        ) : (
          links.map((link) => (
            <li key={link} >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                download // Add the download attribute
              >
                {link || "Document"}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
