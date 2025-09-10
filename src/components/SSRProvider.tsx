import { useSSROptimization } from "@/hooks/useSSROptimization";

/**
 * Provider component that runs SSR optimizations inside Router context
 */
const SSRProvider = ({ children }: { children: React.ReactNode }) => {
  useSSROptimization();
  return <>{children}</>;
};

export default SSRProvider;