"use client";

import Silk from "@/Reactbits/Silk/Silk";
import { WaypointsIcon } from "@/components/ui/waypoints";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
export default function Page() {
  const router = useRouter();
  const {login, isAuthenticated} =useAuth();
const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    branchName: "",
    semesterNumber: "",
    name: "",
    yearNumber: "",
    rollNumber: "",
  });
  useEffect(()=>{
    if(isAuthenticated){
        router.push("/")
    }
  },[isAuthenticated, router])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true)
    try {

      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // Store token (optional: localStorage or cookie)
      localStorage.setItem("token", data.token);
      toast.success("Sign Up Successful")
      await login(formData.email, formData.password)
      router.push("/vault");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong");
    }finally{
        setProcessing(false)
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col sm:flex-row p-4 sm:p-10">
      <div className="w-full sm:w-1/2 h-[15rem] sm:h-full bg-black/70 relative overflow-hidden rounded-t-3xl sm:rounded-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent z-10 pointer-events-none"></div>
        <Silk
          speed={5}
          scale={1}
          color="#07921E"
          noiseIntensity={1.5}
          rotation={0}
        />
        <h2 className="absolute top-0 z-19 text-white text-[1.8rem] sm:text-[3rem] tracking-tight leading-8 sm:leading-10 font-bold p-5 sm:p-8">
          Get access to all materials here in one place with just a simple sign
          up
        </h2>
      </div>

      <div className="w-full sm:w-1/2 h-auto bg-[var(--white)]/98 p-5 flex flex-col justify-center rounded-b-3xl sm:rounded-none sm:rounded-tr-3xl sm:rounded-br-3xl">
        <div className="pl-3 mb-3 sm:mb-5">
          <WaypointsIcon size={40} />
          <h2 className="text-[var(--black)] font-bold text-[1.5rem] sm:text-[2rem] mt-2">
            Get Started
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-1 sm:p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border-2 border-black rounded-[0.5rem] px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border-2 border-black rounded-[0.5rem] px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="branchName" className="text-gray-700 mb-1">
              Branch Name
            </label>
            <select
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className="border-2 border-black rounded-[0.5rem] px-3 py-2 bg-white"
            >
              <option value="" disabled>
                Select Branch
              </option>
              <option value="Computer Science and Engineering">
                Computer Science and Engineering
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Chemical">Chemical</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="semesterNumber" className="text-gray-700 mb-1">
              Semester Number
            </label>
            <input
              type="number"
              id="semesterNumber"
              name="semesterNumber"
              value={formData.semesterNumber}
              onChange={handleChange}
              min={1}
              max={8}
              className="border-2 border-black rounded-[0.5rem] px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-2 border-black rounded-[0.5rem] px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="yearNumber" className="text-gray-700 mb-1">
              Year Number
            </label>
            <input
              type="number"
              id="yearNumber"
              name="yearNumber"
              value={formData.yearNumber}
              onChange={handleChange}
              className="border-2 border-black rounded-[0.5rem] px-3 py-2"
            />
          </div>

          <div className="col-span-full">
            <label htmlFor="rollNumber" className="text-gray-700 mb-1">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="w-full border-2 border-black rounded-[0.5rem] px-3 py-2"
            />
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-black text-white py-2 rounded-[0.5rem] hover:bg-opacity-90 transition hover:bg-black/80"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
