'use client'
import Image from "next/image";
import SplitText from "@/Reactbits/SplitText/SplitText";
import Magnet from "@/Reactbits/Magnet/Magnet";
import AnimatedContent from "@/Reactbits/AnimatedContent/AnimatedContent";
import ContributeSection from "@/components/ContributeSection";
import Features from "@/components/Features";
import Link from "next/link";
import { useEffect, useState } from "react";
function useIsMobile(query = "(max-width: 768px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    const handleChange = () => setIsMobile(media.matches);

    handleChange(); // Set initial value
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return isMobile;
}
export default function Home() {
  const isMobile = useIsMobile();
  const textAlign = isMobile ? "center" : "left";
  return (
    <div className="flex flex-col items-center justify-center">
      {/* 🔥 Responsive wrapper */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-[6rem] sm:mt-[6rem] mt-[2rem] gap-10 px-8 sm:px-0">
        {/* 🪄 Heading block */}
        <div className="flex flex-col items-start justify-center gap-10 w-full sm:w-auto">
          <div className="text-[2.3rem] sm:text-[6rem] font-[800] tracking-[-0.1rem] sm:tracking-[-0.3rem] leading-[3rem] sm:leading-[5rem] w-full sm:w-[40rem] text-[var(--color-4)] flex flex-col items-center justify-center sm:flex-none sm:items-start sm:justify-start">
            <SplitText
              text="Your Central Hub for"
              delay={100}
              duration={1.8}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign={textAlign}
            />
            <div className="text-[var(--color-3)] inline-block">
              <SplitText
                text="Semester-Wise"
                delay={100}
                duration={1.8}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign={textAlign}
              />
            </div>
            <SplitText
              text="Study Materials"
              delay={100}
              duration={2.2}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign={textAlign}
            />
          </div>
          <div className="w-full sm:w-[60%] text-center sm:text-left">
            <SplitText
              text="Find End Semesters, Mid Semesters, Class Lectures, notes, and more, all in one place!"
              className="text-[0.7rem] sm:text-[1.2rem] font-[500] text-white/60"
              delay={100}
              duration={1.4}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign={textAlign}
            />
          </div>
        </div>
        <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          duration={1.2}
          ease="bounce.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
          <Magnet padding={100} disabled={false} magnetStrength={10}>
            <Link href="/vault" title="Take me to the Vault!">
              <div className="">
                <Image
                  src="/Chill-Time.svg"
                  alt="Chill Time"
                  width={200} // mobile-friendly size
                  height={200}
                  className="sm:w-[300px] sm:h-[300px] w-50 h-50"
                  style={{
                    filter:
                      "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                  }}
                />
              </div>
            </Link>
          </Magnet>
        </AnimatedContent>
      </div>

      {/* 📦 Features */}
      <div className="flex items-center justify-center w-full mt-[7rem] rounded-5xl">
        <Features />
      </div>

      <ContributeSection />
    </div>
  );
  
}
