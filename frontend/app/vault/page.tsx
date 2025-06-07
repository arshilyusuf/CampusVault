"use client";
import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/search";
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

export default function VaultPage() {
  const [branch, setBranch] = useState(branches[0]);
  const [semester, setSemester] = useState(semesters[0]);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-12 gap-10">
      <h1 className="text-6xl md:text-7xl font-extrabold text-center text-[var(--color-4)] mb-4 tracking-tight drop-shadow-white">
        The Vault
      </h1>
      <div className="p-10 bg-black/20 rounded-3xl flex flex-col gap-3 backdrop-blur-2xl">
        <h2 className="text-2xl md:text-2xl font-bold text-center text-[#f2f2f2] tracking-tight">
          Search for your required material by your branch and semester
        </h2>
        <form
          className="flex  items-center justify-between gap-6 bg-black/40 p-8 rounded-xl shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/material/${encodeURIComponent(branch)}/${semester}`);
          }}
        >
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="branch"
                className="font-medium text-[var(--color-3)]"
              >
                Branch
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="pt-[0.5rem] pb-[0.5rem] pr-[0.8rem] pl-[0.8rem] rounded-[4px] bg-gray-50 text-black transition-all duration-200"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="semester"
                className="font-medium text-[var(--color-3)]"
              >
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="pt-[0.5rem] pb-[0.5rem] pr-[0.8rem] pl-[0.8rem] rounded-[4px]  bg-gray-50 text-black transition-all duration-200"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 md:mt-7">
            <Button><SearchIcon/></Button>
          </div>
        </form>
      </div>
    </div>
  );
}
