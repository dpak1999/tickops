import { Loader } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin size-6 text-muted-foreground" />
    </div>
  );
};

export default PageLoader;
