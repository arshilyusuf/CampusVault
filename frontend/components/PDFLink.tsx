import React, { useState } from "react";
import { FilePenLineIcon } from "./ui/file-pen-line";
import { HandCoinsIcon } from "./ui/hand-coins";
import { DeleteIcon } from "./ui/delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const [showDeleteToolTip, setShowDeleteToolTip] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null); 
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();

  // Safely access the links array
  const links = subject ? subject[uploadtype] : null;
  console.log("Links:", links);
  const confirmDelete = async () => {
    if (pendingDelete) {
      await handleDelete(pendingDelete);
      setPendingDelete(null);
    }
  };

  // Cancel delete handler
  const cancelDelete = () => setPendingDelete(null);

  const handleContribute = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const params = new URLSearchParams({
      branchName: subject.branchName,
      semesterNumber: subject.semesterNumber,
      subjectName: subject.name,
      uploadType: uploadtype,
    });
    router.push(`/contribute?${params.toString()}`);
  };
  const handleDelete = async (link) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsRequesting(true);
    try {
      const branchName = subject.branchName;
      const semesterNumber = subject.semesterNumber;
      const subjectName = subject.name;

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/deleteMaterial`;
      const requestData = {
        branchName,
        semesterNumber,
        subjectName,
        uploadType: uploadtype,
        materialUrl: link,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        toast.success("Material Deleted successfully!");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(
          `Delete Request failed: ${errorData.message || response.statusText}`
        );
      }
    } catch (e) {
      console.error("Request error:", error);
      toast.error("An error occurred while submitting the request.");
    } finally {
      setIsRequesting(false);
    }
  };
  const handleRequest = async () => {
    console.log("handleRequest called");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsRequesting(true);
    try {
      const branchName = subject.branchName;
      const semesterNumber = subject.semesterNumber;
      const subjectName = subject.name;

      const encodedBranchName = encodeURIComponent(branchName);
      const encodedSubjectName = encodeURIComponent(subjectName);

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requests/${encodedBranchName}/${semesterNumber}/${encodedSubjectName}/${uploadtype}`;

      const requestData = {
        requestingUser: user?.id, // Use user ID from AuthContext
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response:", response);

      if (response.ok) {
        toast.success("Request submitted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(
          `Request failed: ${errorData.message || response.statusText}`
        );
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
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
            <p className="mb-4 text-black font-semibold">
              Are you sure you want to delete this material?
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={confirmDelete}
                disabled={isRequesting}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDelete}
                disabled={isRequesting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
            <li key={link} className="flex items-center gap-2">
              {links.length !== 0 && user?.role === "admin" && (
                <button
                  className="bg-red-700 w-7 h-7 rounded-full p-[0.3rem] text-white cursor-pointer flex items-center ml-2 relative hover:scale-[1.05] transition-transform duration-200 ease-in-out"
                  onMouseEnter={() => setShowDeleteToolTip(true)}
                  onMouseLeave={() => setShowDeleteToolTip(false)}
                  onClick={() => setPendingDelete(link)}
                  disabled={isRequesting}
                >
                  <DeleteIcon size={18} />
                  {showDeleteToolTip && (
                    <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-100 transition-opacity duration-200 opacity-100 border-[var(--color-3)] border-[1px]">
                      Delete
                    </div>
                  )}
                </button>
              )}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
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
