'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Subject from "@/components/Subject";
interface Subject {
  _id: number;
  name: string;
  description: string;
}

const MaterialPage = () => {
  const { branch, semester } = useParams();
  const [branchName, setBranchName] = useState<string>('');
  const semesterNumber = semester as string;
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (branch) {
      setBranchName(decodeURIComponent(branch as string).replace(/\+/g, ' '));
    }
  }, [branch]);

  useEffect(() => {
    if (branchName && semesterNumber) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/public/subjects/${branchName}/${semesterNumber}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          setSubjects(data.subjects || []);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [branchName, semesterNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!subjects) {
    return <div>No subjects found.</div>;
  }

  return (
    <div className="mt-4">
      <h1 className="text-4xl text-white font-bold border-b-5 border-b-[white] pb-4">{branchName} - Semester {semester}</h1>
      { subjects.length > 0 ? (
            <ul className="mt-4">
                  {subjects.map((subject) => (
                        <li  key = {subject._id} >
                              <Subject subject={subject} />
                        </li>
                  ))}
            </ul>
      ) : (
            <div className="mt-4 text-white">No subjects available for this semester.</div>
      )}


                        
    </div>
  );
};

export default MaterialPage;
