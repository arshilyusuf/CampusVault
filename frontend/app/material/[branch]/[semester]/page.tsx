"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Subject from "@/components/Subject";
import AnimatedList from "@/Reactbits/AnimatedList/AnimatedList";
import Loading from "@/app/loading"; // Import the Loading component
interface Subject {
  _id: number;
  name: string;
  description: string;
}

const MaterialPage = () => {
  const { branch, semester } = useParams();
  const [branchName, setBranchName] = useState<string>("");
  const semesterNumber = semester as string;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (branch) {
      setBranchName(decodeURIComponent(branch as string).replace(/\+/g, " "));
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
          setSubjects(data.subjects);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [branchName, semesterNumber]);

  return (
    <div className="mt-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60">
          <Loading />
        </div>
      )}
      <h1 className="text-4xl text-white font-bold border-b-5 border-b-[white] pb-4">
        {branchName} - Semester {semester}
      </h1>
      {subjects.length > 0 ? (
        <AnimatedList
          renderItem={(item: Subject) => (
            <Subject key={item._id} subject={item} />
          )}
          items={subjects}
          onItemSelect={(item) => console.log(item)}
          showGradients={true}
          enableArrowNavigation={true}
          className="flex flex-col gap-4 mt-4 h-150 "
          itemClassName="w-[100%] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          displayScrollbar={true}
        />
      ) : (
        <div className="mt-4 font-semibold flex items-center justify-center h-[500px] text-white">
          No subjects available for this semester.
        </div>
      )}
    </div>
  );
};

export default MaterialPage;
