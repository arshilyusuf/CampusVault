"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/Button";

const branches = [
  "Computer Science and Engineering",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Other",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const uploadTypes = ["endsem", "midsem", "lectures", "notes", "other"];

export default function ContributePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [branchName, setBranchName] = useState(branches[0]);
  const [semesterNumber, setSemesterNumber] = useState(semesters[0]);
  const [subjectName, setSubjectName] = useState("");
  const [uploadType, setUploadType] = useState(uploadTypes[0]);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }
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
          console.log(data);
          setSubjects(
            data.subjects.map((subject: { name: string }) => subject.name)
          );
        } else {
          console.error("Failed to fetch subjects");
          toast.error("Failed to fetch subjects");
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
        setSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [branchName, semesterNumber]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files));
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

      if (response.ok) {
        toast.success(
          "Your contribution has been sent to the admins and will be reviewed"
        );
        setBranchName(branches[0]);
        setSemesterNumber(semesters[0]);
        setSubjectName("");
        setUploadType(uploadTypes[0]);
        setPdfFiles([]);
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 gap-8">
      <h1 className="text-4xl font-bold text-center text-[var(--color-3)]">
        Contribute Material
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-8 bg-black/20 rounded-2xl backdrop-blur-2xl"
      >
        <label className="block text-5 font-bold  text-white">
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
            accept=".pdf"
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
        <Button
          type="submit"
          buttonClassName="w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Contribution"}
        </Button>
      </form>
    </div>
  );
}
