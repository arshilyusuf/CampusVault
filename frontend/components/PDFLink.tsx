import React, { useState } from "react";
import { FilePenLineIcon } from "./ui/file-pen-line";
import { HandCoinsIcon } from "./ui/hand-coins";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

//specify upload type type
const uploadTypeMap = {
  endsem: "End Semester",
  midsem: "Mid Semester",
  lectures: "Lectures",
  notes: "Notes",
  other: "Other",
};

export default function PDFLink({ subject, uploadtype }) {
  const { isAuthenticated, user } = useAuth();
  const [showContributeTooltip, setShowContributeTooltip] = useState(false);
  const [showRequestTooltip, setShowRequestTooltip] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();

  // Safely access the links array
  const links = subject ? subject[uploadtype] : null;
  console.log("Links:", links);

  const handleContribute = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // ...existing code...
  };

  const handleRequest = async () => {
    console.log("handleRequest called");
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsRequesting(true);
    try {
      const branchName = subject.branchName;
      const semesterNumber = subject.semesterNumber;
      const subjectName = subject.name;

      const encodedBranchName = encodeURIComponent(branchName);
      const encodedSubjectName = encodeURIComponent(subjectName);

      const url = `http://localhost:8000/api/requests/${encodedBranchName}/${semesterNumber}/${encodedSubjectName}/${uploadtype}`;

      const requestData = {
        requestingUser: user?.id, // Use user ID from AuthContext
      };

      console.log("Request URL:", url);
      console.log("Request data:", requestData);
      console.log("Authorization token:", localStorage.getItem('token'));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response:", response);

      if (response.ok) {
        toast.success("Request submitted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Request failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Request error:", error);
      toast.error("An error occurred while submitting the request.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleClick = () => {
    console.log("Button clicked!");
    handleRequest();
  };

  return (
    <div className="border-b-2 pl-2 border-gray-700 py-4">
      <span>{uploadTypeMap[uploadtype] || uploadtype}: </span>
      <div className="flex items-center mt-1 mb-2">
        <button
          className="bg-[var(--color-3)] w-7 h-7 rounded-full p-[0.3rem] text-black cursor-pointer flex items-center relative hover:scale-[1.05] transition-transform duration-200 ease-in-out"
          onClick={handleContribute}
          onMouseEnter={() => setShowContributeTooltip(true)}
          onMouseLeave={() => setShowContributeTooltip(false)}
          disabled={isRequesting}
        >
          <FilePenLineIcon size={17} />
          {showContributeTooltip && (
            <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-100 transition-opacity duration-200 opacity-100 border-[var(--color-3)] border-[1px]">
              Contribute
            </div>
          )}
        </button>
        <button
          className="bg-[var(--color-3)] w-7 h-7 rounded-full p-[0.3rem] text-black cursor-pointer flex items-center ml-2 relative hover:scale-[1.05] transition-transform duration-200 ease-in-out"
          onMouseEnter={() => setShowRequestTooltip(true)}
          onMouseLeave={() => setShowRequestTooltip(false)}
          onClick={handleClick}
          disabled={isRequesting}
        >
          <HandCoinsIcon size={17} />
          {showRequestTooltip && (
            <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-100 transition-opacity duration-200 opacity-100 border-[var(--color-3)] border-[1px]">
              Request
            </div>
          )}
        </button>
      </div>
      <ul>
        {!links || links.length === 0 ? (
          <li className="text-gray-500">No links available</li>
        ) : (
          links.map((link) => (
            <li key={link}>
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
