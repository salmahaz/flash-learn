import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 px-2 py-1 rounded-md shadow transition ease-in-out duration-300 text-[10px] sm:text-xs bg-white text-[#006A71] border border-[#006A71] hover:bg-[#F2EFE7]"
      >
        <ArrowLeft size={14} />
        Back
      </button>
    </div>
  );
};

export default BackButton;