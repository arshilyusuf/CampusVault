import SpotlightCard from "@/Reactbits/SpotlightCard/SpotlightCard";
import InfiniteScroll from "@/Reactbits/InfiniteScroll/InfiniteScroll";

const spotlightItems = [
  {
    content: (
      <SpotlightCard
        className="flex flex-col items-start max-w-md justify-between"
        spotlightColor="rgba(0, 229, 255, 0.5)"
      >
        <div>🏦</div>
        <div>
          <h2 className="text-2xl text-[white] font-semibold mb-2">
            Semester-wise Vault
          </h2>
          <p className="text-base text-[white]">
            Access and contribute to a curated collection of study materials,
            notes, and resources organized by our own alumni.
          </p>
        </div>
      </SpotlightCard>
    ),
  },
  {
    content: (
      <SpotlightCard
        className="flex flex-col items-start max-w-md justify-between"
        spotlightColor="rgba(255, 0, 85, 0.4)"
      >
        <div>💬</div>
        <div>
          <h2 className="text-2xl text-[white] font-semibold mb-2">
            Request & Feedback
          </h2>
          <p className="text-base text-[white]">
            Request missing materials or provide feedback to help improve the
            platform for everyone.
          </p>
        </div>
      </SpotlightCard>
    ),
  },
  {
    content: (
      <SpotlightCard
        className="flex flex-col items-start max-w-md justify-between"
        spotlightColor="rgba(207, 15, 71, 0.4)"
      >
        <div>🌟</div>
        <div>
          <h2 className="text-2xl text-[white] font-semibold mb-2">
            Community Driven
          </h2>
          <p className="text-base text-[white]">
            Join a growing community of learners and contributors, making
            education more accessible for all.
          </p>
        </div>
      </SpotlightCard>
    ),
  },
];

export default function Features() {
  return (
    <InfiniteScroll
      items={spotlightItems}
      isTilted={true}
      tiltDirection="left"
      autoplay={true}
      autoplaySpeed={0.1}
      autoplayDirection="down"
      pauseOnHover={true}
    />
  );
}
