"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation"; // <-- import useSearchParams
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/Button";

const branches = [
  "Select Branch",
  "Computer Science and Engineering",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Other",
];

export const semesters = ["Select Semester","1", "2", "3", "4", "5", "6", "7", "8"];

export const uploadTypes = ["endsem", "midsem", "lectures", "notes", "other"];

export default function ContributePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // <-- get search params

  // Read params from URL
  const initialBranchName = searchParams.get("branchName") || branches[0];
  const initialSemesterNumber = searchParams.get("semesterNumber") || semesters[0];
  const initialSubjectName = searchParams.get("subjectName") || "";
  const initialUploadType = searchParams.get("uploadType") || uploadTypes[0];

  // Use initial values from params if present
  const [branchName, setBranchName] = useState(initialBranchName);
  const [semesterNumber, setSemesterNumber] = useState(initialSemesterNumber);
  const [subjectName, setSubjectName] = useState(initialSubjectName);
  const [uploadType, setUploadType] = useState(initialUploadType);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/public/subjects/${encodeURIComponent(
            branchName
          )}/${semesterNumber}`
        );
        if (response.ok) {
          const data = await response.json();
          setSubjects(
            data.subjects.map((subject: { name: string }) => subject.name)
          );
        } else {
          
          setSubjects([]);
        }
      } catch (error) {
        setSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [branchName, semesterNumber]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("branchName", branchName);
      formData.append("semesterNumber", semesterNumber);
      formData.append("subjectName", subjectName);
      formData.append("uploadType", uploadType);
      formData.append("user", JSON.stringify(user));

      pdfFiles.forEach((file) => {
        formData.append("pdfFiles", file);
      });

      // Add this before your fetch call
      for (const pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      const response = await fetch(
        "http://localhost:8000/api/users/contribute",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      console.log("Contribution response:", response);
      if (response.ok) {
        toast.success(
          "Your contribution has been sent to the admins and will be reviewed"
        );
        setBranchName(branches[0]);
        setSemesterNumber(semesters[0]);
        setSubjectName("");
        setUploadType(uploadTypes[0]);
        setPdfFiles([]);
        router.push("/");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to submit contribution request"
        );
      }
    } catch (error) {
      console.error("Contribution error:", error);
      console.error("Contribution error details:", error.message, error.stack); // Log more details
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex bg-black/10 flex-col-reverse sm:flex-row items-left mt-5 sm:mt-0 justify-between min-h-[80vh] rounded-4xl gap-8 backdrop-blur-3xl p-4 sm:p-0"
     
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full sm:w-[60%] overflow-hidden overflow-y-auto gap-6 p-6 sm:p-8 pt-10 sm:pt-15 bg-black rounded-3xl sm:rounded-4xl sm:rounded-tr-[5rem] sm:rounded-br-[5rem]"
      >
        <label className="block text-sm sm:text-5 font-bold text-white">
          Branch:
          <select
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 font-semibold shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/20 p-3"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-white">
          Semester:
          <select
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 font-semibold shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/20 p-3"
          >
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-white">
          Subject Name:
          {isLoadingSubjects ? (
            <div>Loading subjects...</div>
          ) : subjects.length === 0 ? (
            <div>No subjects available</div>
          ) : (
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 font-semibold shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/20 p-3"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          )}
        </label>

        <label className="block text-sm font-medium text-white">
          Upload Type:
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 font-semibold shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/20 p-3"
          >
            {uploadTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-white">
          PDF Files:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-white file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
            accept=".pdf, .ppt, .pptx"
          />
        </label>

        {pdfFiles.length > 0 && (
          <div>
            <p className="text-sm font-medium text-white">Selected Files:</p>
            <ul>
              {pdfFiles.map((file, index) => (
                <li key={index} className="text-white">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" buttonClassName="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Contribution"}
        </Button>
      </form>

      <h1 className="text-3xl ml-3 sm:ml-0 sm:text-4xl flex flex-col font-black text-left sm:text-right mt-3 sm:mt-7 tracking-tight sm:mr-10 text-[var(--white)]">
        Contribute Material
        <span className="text-base sm:text-lg font-thin text-white mt-3">
          Select your branch, semester, and subject to send a contribution
          request. Your request will be reviewed by the admins.
        </span>
      </h1>
    </div>
  );
  
}
