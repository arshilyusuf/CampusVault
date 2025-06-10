"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});

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

  // Placeholder handlers for upload and add subject
  const handleUploadMaterial = () => {
    toast.info("Upload Material clicked");
    // Implement upload logic or modal here
  };

  const handleAddSubject = () => {
    toast.info("Add Subject clicked");
    // Implement add subject logic or modal here
  };

  return (
    <div className="min-h-[90vh] p-8 backdrop-blur-3xl bg-[var(--black)]/10  rounded-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-[var(--white)]">
        Admin Dashboard
      </h1>
      <div
        className="grid w-full grid-cols-4 grid-rows-4 gap-8"
          style={{ minHeight: "60vh" }}
      >
        {/* Contribution Requests: spans 2 columns in row 1 */}
        <div className="bg-black rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col col-span-4 row-span-3 col-start-1 row-start-1">
          <h2 className="text-3xl w-fit pb-2 font-semibold mb-4 border-b-4 border-b-[var(--color-3)] text-[var(--color-3)]">
            Contribution Requests
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : requests.length === 0 ? (
            <div>No requests found for your branch and year.</div>
          ) : (
            <ul className="space-y-4 max-h-72 overflow-y-auto">
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
                                Request Details
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
                            <Button>Approve</Button>
                            <Button backgroundColor="red">Reject</Button>
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
        <div className="bg-white/80 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center justify-center col-span-2 row-span-1 col-start- row-start-4">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--black)]">
            Upload Material
          </h2>
          <Button buttonClassName="w-full" onClick={handleUploadMaterial}>
            Upload
          </Button>
        </div>
        <div className="bg-white/80 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center justify-center col-span-2 row-span-1 col-start-3 row-start-4">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--black)]">
            Add Subject
          </h2>
          <Button buttonClassName="w-full" onClick={handleAddSubject}>
            Add Subject
          </Button>
        </div>
      </div>
    </div>
  );
}
