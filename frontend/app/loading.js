export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div class="flex flex-row gap-2 ">
        <div class="w-4 h-4 rounded-full bg-red-white animate-bounce"></div>
        <div class="w-4 h-4 rounded-full bg-red-white animate-bounce [animation-delay:-.3s]"></div>
        <div class="w-4 h-4 rounded-full bg-red-white animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
}
