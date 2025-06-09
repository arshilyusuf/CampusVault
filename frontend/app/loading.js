import {LoaderPinWheelIcon} from "@/components/ui/loader-pinwheel"
export default function Loading() {

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <LoaderPinWheelIcon className="w-16 h-16 text-gray-500 animate-spin" />
    </div>
  );
}
