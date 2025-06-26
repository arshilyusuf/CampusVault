"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { semesters, uploadTypes } from "../contribute/page";
import { XIcon } from "@/components/ui/x";
import { CheckIcon } from "@/components/ui/check";
import { UploadIcon } from "@/components/ui/upload";
import { PlusIcon } from "@/components/ui/plus";
export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null
  );
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});
  const [approvingContributionId, setApprovingContributionId] = useState<
    string | null
  >(null);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectSemester, setNewSubjectSemester] = useState("");
  const [semesterNumber, setSemesterNumber] = useState(semesters[0]);
  const [subjectName, setSubjectName] = useState("");
  const [uploadType, setUploadType] = useState(uploadTypes[0]);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [materialRequests, setMaterialRequests] = useState<any[]>();
  // Only allow admins
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch contribution requests for admin's branch and year
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.branchName || !user?.yearNumber) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/contributions/${encodeURIComponent(
            user.branchName
          )}/${user.yearNumber}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else {
          setRequests([]);
        }
      } catch (err) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.branchName && user?.yearNumber) fetchRequests();
  }, [user]);

  // Fetch subjects for the selected semester
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/public/subjects/${encodeURIComponent(
            user?.branchName || ""
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
  }, [user?.branchName, semesterNumber]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.branchName || !user?.yearNumber) return;
      setLoading(true);
      try {
        console.log(
          `http://localhost:8000/api/requests/${encodeURIComponent(
            user.branchName
          )}/${user.yearNumber}`
        );
        const res = await fetch(
          `http://localhost:8000/api/requests/${encodeURIComponent(
            user.branchName
          )}/${user.yearNumber}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          console.log("Actual response data:", data);
          setMaterialRequests(data);
        } else {
          setMaterialRequests([]);
        }
      } catch (err) {
        setMaterialRequests([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.branchName && user?.yearNumber) fetchRequests();
  }, [user]);
  const handleExpand = async (req: any) => {
    if (expandedRequestId === req._id) {
      setExpandedRequestId(null);
      return;
    }
    setExpandedRequestId(req._id);
    // Fetch user details if not already fetched
    const userId = req.requestingUser || req.userId;
    if (userId && !userDetails[userId]) {
      try {
        const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserDetails((prev) => ({ ...prev, [userId]: data }));
        }
      } catch (e) {
        // ignore error
      }
    }
  };

  const approveContribution = async (id: string) => {
    setApprovingContributionId(id);
    setProcessingRequest(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/approveContribution/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        toast.success("Contribution approved successfully!");
        // Refresh requests after approval
        const updatedRequests = requests.filter((req) => req._id !== id);
        setRequests(updatedRequests);
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to approve contribution: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (err: any) {
      toast.error(`Failed to approve contribution: ${err.message}`);
    } finally {
      setApprovingContributionId(null);
      setProcessingRequest(false);
    }
  };

  const rejectContribution = async (id: string) => {
    setProcessingRequest(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/rejectContribution/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        toast.success("Contribution rejected successfully!");
        // Refresh requests after rejection
        const updatedRequests = requests.filter((req) => req._id !== id);
        setRequests(updatedRequests);
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to reject contribution: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (err: any) {
      toast.error(`Failed to reject contribution: ${err.message}`);
    } finally {
      setProcessingRequest(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmitMaterial = async () => {
    if (
      !semesterNumber ||
      !subjectName ||
      !uploadType ||
      pdfFiles.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    pdfFiles.forEach((file) => {
      formData.append("pdfFiles", file);
    });
    formData.append("semesterNumber", semesterNumber);
    formData.append("branchName", user?.branchName || "");
    formData.append("subjectName", subjectName);
    formData.append("uploadType", uploadType);
    formData.append("user", JSON.stringify(user));
    for (const pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    try {
      setProcessingRequest(true);
      const res = await fetch("http://localhost:8000/api/admin/uploadPdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Material uploaded successfully!");
        setPdfFiles([]);
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to upload material: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (err: any) {
      toast.error(`Failed to upload material: ${err.message}`);
    } finally {
      setProcessingRequest(false);
    }
  };

  const handleAddSubjectSubmit = async () => {
    if (!newSubjectName || !newSubjectSemester) {
      toast.error("Subject name and semester are required");
      return;
    }

    try {
      setProcessingRequest(true);
      const res = await fetch("http://localhost:8000/api/admin/addSubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          branchName: user?.branchName,
          semesterNumber: newSubjectSemester,
          subjectName: newSubjectName,
        }),
      });

      if (res.ok) {
        toast.success("Subject added successfully!");
        setNewSubjectName("");
        setNewSubjectSemester("");
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to add subject: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (err: any) {
      toast.error(`Failed to add subject: ${err.message}`);
    } finally {
      setProcessingRequest(false);
    }
  };

  return (
    <div className="min-h-[90vh] p-8 backdrop-blur-3xl bg-[var(--color-3)]/10  rounded-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-[var(--white)]">
        Admin Dashboard
      </h1>
      <div
        className="grid w-full grid-cols-4 grid-rows-4 gap-8"
        style={{ minHeight: "60vh", maxHeight: "170vh" }}
      >
        {/* Contribution Requests: spans 2 columns in row 1 */}
        <div className="bg-black rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col col-span-4 row-span-2 col-start-1 row-start-1">
          <h2 className="flex items-center justify-center gap-2 text-3xl w-fit pb-2 font-semibold mb-4 border-b-4 border-b-[var(--color-3)] text-[var(--color-3)]">
            Contribution Requests
            {requests?.length > 0 && (
              <div className="w-5 h-5 flex items-center justify-center rounded-full text-sm font-semibold bg-yellow-400 text-black">
                {requests.length > 0 && requests.length}
              </div>
            )}
          </h2>

          {loading ? (
            <div>Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-white w-full h-[100px] flex items-center justify-center">
              No requests found for your branch and year.
            </div>
          ) : (
            <ul className="space-y-4 max-h-92 overflow-y-auto">
              {requests.map((req) => {
                const isExpanded = expandedRequestId === req._id;
                const userId = req.requestingUser || req.userId;
                const userInfo = userDetails[userId];
                return (
                  <li
                    key={req._id}
                    className="border-b border-gray-200 pb-5 flex flex-col transition-all"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-bold text-[var(--white)]">
                          {req.subjectName}
                        </span>
                        <span className="ml-4 text-[var(--white)]">
                          Semester: <b>{req.semesterNumber}</b> | Type:{" "}
                          <b>{req.uploadType}</b>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <FaChevronUp
                            className="text-white cursor-pointer"
                            onClick={() => setExpandedRequestId(null)}
                          />
                        ) : (
                          <FaChevronDown
                            className="text-white cursor-pointer"
                            onClick={() => handleExpand(req)}
                          />
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden flex flex-col items-center mt-4 bg-white/10 rounded-lg p-4"
                        >
                          <div className="flex gap-4 w-full">
                            <div className="mb-5 w-[70%] text-[0.5rem]">
                              <div className="font-semibold text-xl text-[var(--color-3)]">
                                Contribution Details
                              </div>
                              <div className="text-white text-sm">
                                <div>
                                  <b>Branch:</b> {req.branchName}
                                </div>
                                <div>
                                  <b>Semester:</b> {req.semesterNumber}
                                </div>
                                <div>
                                  <b>Subject:</b> {req.subjectName}
                                </div>
                                <div>
                                  <b>Upload Type:</b> {req.uploadType}
                                </div>
                                <div>
                                  <b>Status:</b> {req.status}
                                </div>
                                <div>
                                  <b>Requested At:</b>{" "}
                                  {new Date(req.createdAt).toLocaleString()}
                                </div>

                                <div>
                                  <b>PDF URLs:</b>
                                  <ul className="list-disc ml-6">
                                    {Array.isArray(req.pdfUrls) &&
                                    req.pdfUrls.length > 0 ? (
                                      req.pdfUrls.map(
                                        (url: string, idx: number) => (
                                          <li key={idx}>
                                            <a
                                              href={url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline text-blue-300 break-all"
                                            >
                                              {url}
                                            </a>
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li>No PDFs uploaded</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-xl text-[var(--color-3)]">
                                User Details
                              </div>
                              {userInfo ? (
                                <div className="text-white text-sm">
                                  <div>
                                    <b>Name:</b> {userInfo.name}
                                  </div>
                                  <div>
                                    <b>Email:</b> {userInfo.email}
                                  </div>
                                  <div>
                                    <b>Roll Number:</b> {userInfo.rollNumber}
                                  </div>
                                  <div>
                                    <b>Branch:</b> {userInfo.branchName}
                                  </div>

                                  <div>
                                    <b>Semester:</b> {userInfo.semesterNumber}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-white text-sm">
                                  Loading user details...
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="my-4 flex justify-end gap-4">
                            <Button
                              disabled={
                                processingRequest ||
                                approvingContributionId === req._id
                              }
                              onClick={() => approveContribution(req._id)}
                            >
                              <div className="flex items-center gap-1">
                                {approvingContributionId === req._id ? (
                                  "Approving..."
                                ) : (
                                  <>
                                    Approve <CheckIcon size={20} />
                                  </>
                                )}
                              </div>
                            </Button>
                            <Button
                              onClick={() => rejectContribution(req._id)}
                              backgroundColor="red"
                              disabled={
                                processingRequest ||
                                approvingContributionId === req._id
                              }
                            >
                              <div className="flex gap-1 items-center">
                                Reject{<XIcon size={20} />}
                              </div>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="bg-black/40 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col items-left justify-between col-span-2 row-span-2 col-start- row-start-3 shadow-white/5">
          <h2 className="text-2xl font-semibold mb-[-2rem] text-[var(--white)]">
            Upload Material
          </h2>
          <p className="text-sm text-white/30 ">
            Make sure to upload the material in the correct semester, subject
            and upload type.
          </p>
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
            buttonClassName="w-full "
            disabled={processingRequest}
            onClick={handleSubmitMaterial}
          >
            <div className="flex justify-center">
              {<UploadIcon size={25} />}
            </div>
          </Button>
        </div>
        <div className="bg-black/40 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col items-left justify-center col-span-2 row-span-1 col-start-3 row-start-3 shadow-white/5">
          <h2 className="text-2xl font-semibold text-[var(--white)]">
            Add New Subject
          </h2>
          <p className="text-sm text-white/30 mb-4 ">
            Please enter the subject name in Title Case with appropriate spaces.
          </p>
          <input
            type="text"
            placeholder="Subject Name"
            className="border bg-[var(--white)] p-2 rounded mb-2 text-[var(--black)]"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="8"
            placeholder="Semester"
            className="border bg-[var(--white)] p-2 rounded mb-2 text-[var(--black)]"
            value={newSubjectSemester}
            onChange={(e) => setNewSubjectSemester(e.target.value)}
          />

          <Button
            buttonClassName="w-full mt-3"
            disabled={processingRequest}
            onClick={handleAddSubjectSubmit}
          >
            <div className="flex justify-center">{<PlusIcon size={25} />}</div>
          </Button>
        </div>
        <div className="bg-black/40 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col items-left justify-center col-span-2 row-span-1 col-start-3 row-start-4 shadow-white/5">
          <h2 className="text-2xl font-semibold text-[var(--white)] mb-4 flex items-center gap-2">
            Material Requests
            {materialRequests?.length > 0 && (
              <div className="w-5 h-5 flex items-center justify-center rounded-full text-sm font-semibold bg-yellow-400 text-black">
                {materialRequests.length}
              </div>
            )}
          </h2>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : !materialRequests || materialRequests.length === 0 ? (
            <div className="text-white w-full h-[60px] flex items-center justify-center">
              No material requests found for your branch and year.
            </div>
          ) : (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {materialRequests.map((req) => (
                <li
                  key={req._id}
                  className="border-b border-gray-700 pb-2 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--color-3)]">
                        {req.subjectName}
                      </span>
                      <span className="ml-2 text-white/80">
                        Semester: <b>{req.semesterNumber}</b> | Type:{" "}
                        <b>{req.uploadType}</b>
                      </span>
                    </div>
                    <span className="text-xs text-white/50">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `http://localhost:8000/api/requests/deleteRequestAndNotify/${req._id}`,
                            {
                              method: "DELETE",

                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );
                          
                          
                        
                          if (res.ok) {
                            toast.success("Request Resolved !");
                            setMaterialRequests((prev) =>
                              prev?.filter((item) => item._id !== req._id)
                            );
                          } else {
                            toast.error("Failed to resolve Request");
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to resolve Request");
                        }
                      }}
                      className="mt-2 self-start text-sm bg-[var(--color-3)] hover:bg-[var(--color-2)] text-black p-2 rounded transition-all duration-200 flex gap-2 items-center"
                    >
                      Complete Request {<CheckIcon size={17} />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
