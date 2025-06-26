"use client";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function Page() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const profile = user || {
    email: "",
    role: "",
    branchName: "",
    semesterNumber: 0,
    rollNumber: "",
    name: "",
    yearNumber: 0,
  };
  useEffect(()=>{
    if(!isAuthenticated){
      router.push("/login")
    }
  })
  const handleLogOut = async () =>{
    try{
      await logout();
      router.push("/")

    }catch(err){
      toast.error(err)
    }
  }
  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 max-w-md w-full h-fit text-white ">
        <h1 className="text-3xl font-bold mb-4 w-fit text-left text-[var(--color-3)] border-b-2 border-b-[var(--color-3)]">
          Profile
        </h1>
        <div className="space-y-3 text-white">
          <div>
            <strong>Name:</strong> {profile.name}
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
          <div>
            <strong>Role:</strong> {profile.role}
          </div>
          <div>
            <strong>Roll Number:</strong> {profile.rollNumber}
          </div>
          <div>
            <strong>Branch:</strong> {profile.branchName}
          </div>
          <div>
            <strong>Semester:</strong> {profile.semesterNumber}
          </div>
          <div>
            <strong>Year:</strong> {profile.yearNumber}
          </div>
        </div>
        <Button
          onClick={handleLogOut}
          buttonClassName=" w-full mt-5"
          backgroundColor="red"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
