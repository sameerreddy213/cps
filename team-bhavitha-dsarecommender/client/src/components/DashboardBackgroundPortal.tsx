// components/DashboardBackgroundPortal.tsx
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";

const DashboardBackgroundPortal = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden"
      style={{ zIndex: -1, filter: "blur(8px)", pointerEvents: "none" }}
    >
      <div className="w-100 h-100 overflow-auto bg-dark text-white p-4">
        <Dashboard asBackground />
      </div>
    </div>,
    document.body
  );
};

export default DashboardBackgroundPortal;
