"use client";
import { useRef, useEffect } from "react";
import SplitText from "@/Reactbits/SplitText/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
gsap.registerPlugin(ScrollTrigger);

export default function ContributeSection() {
  const textRef = useRef(null);
  const starRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    if (starRef.current) {
      gsap.fromTo(
        starRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          
          scrollTrigger: {
            trigger: starRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full mt-[6rem] h-[100vh] ">
      <div ref={textRef} className="opacity-0">
        <SplitText
          text="Want to contribute? Join us in building a comprehensive repository of semester-wise study materials!"
          className="text-[3rem] font-[500] tracking-[-0.1rem] leading-[3rem] w-full text-[var(--color-4)] text-center"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="words"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
          rootMargin="-100px"
          textAlign="center"
        />
      </div>

      <div ref={starRef} className="opacity-0">
        <Button onClick={() => router.push("/contribute")}> 
            Contribute Now
        </Button>
      </div>
    </div>
  );
}
