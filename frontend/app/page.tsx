import Image from "next/image";
import SplitText from "@/Reactbits/SplitText/SplitText";
import styles from "./page.module.css";
import Magnet from "@/Reactbits/Magnet/Magnet";
import AnimatedContent from "@/Reactbits/AnimatedContent/AnimatedContent";
import ContributeSection from "@/components/ContributeSection";
import Features from "@/components/Features";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-[100%] mb-[6rem] mt-[6rem]">
        <SplitText
          text="Your Central Hub for Semester-Wise Study Materials"
          className="text-[6rem] font-[800] tracking-[-0.3rem] leading-[5rem] w-[40rem] text-[var(--color-4)]"
          delay={100}
          duration={1.4}
          ease="power3.out"
          splitType="words"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="left"
        />
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
              <div className={`${styles.blurContainer}`}>
                <Image
                  src="/Chill-Time.svg"
                  alt="Chill Time"
                  width={300}
                  height={300}
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
      <div className="flex items-center justify-center w-[100%] mt-[6rem] rounded-5xl">
        <Features />
      </div>
      <ContributeSection />
    </div>
  );
}
