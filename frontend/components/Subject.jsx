"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import PDFLink from "@/components/PDFLink";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Subject({ subject }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pdftypes = ["endsem", "midsem", "lectures", "notes", "other"];

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(subject);
        const branchName = subject.branchName;
        const semesterNumber = subject.semesterNumber;
        const subjectName = subject.name;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/subjects/${encodeURIComponent(
            branchName
          )}/${semesterNumber}/${encodeURIComponent(subjectName)}`
        );

        // console.log(
        //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/subjects/${encodeURIComponent(
        //     branchName
        //   )}/${semesterNumber}/${encodeURIComponent(subjectName)}`
        // );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setSubjectDetails(data.subject);
        console.log("SubejctDetails: ", data.subject);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && !subjectDetails) {
      fetchSubjectDetails();
    }
  }, [isOpen, subjectDetails]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className={`p-6 backdrop-blur-[50px] bg-black/30 mb-4 rounded-lg hover:bg-black/78 hover:text-black transition-colors duration-300 overflow-hidden relative`} // Removed cursor-pointer, added relative
      style={{ backdropFilter: "blur(20px)" }}
      layout
    >
      <div className="flex items-center justify-between">
        <h2
          className={`text-white font-bold text-[1.2rem] ${
            isOpen ? "pb-2 border-b-2 border-b-white" : ""
          }`}
        >
          {subject.subjectName}
        </h2>
        <button
          onClick={toggleOpen} // Use toggleOpen function
          className="text-white hover:text-[var(--color-2)] transition-colors duration-200"
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-4"
        >
          {loading && <p className="text-white">Loading details...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {subjectDetails && (
            <div className="text-white">
              <ul>
                {pdftypes.map((uploadtype) => {
                  return (
                    <li key={uploadtype} className="mb-2">
                      
                      <PDFLink
                        subject={subjectDetails}
                        uploadtype={uploadtype}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
