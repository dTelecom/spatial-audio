import React from "react";
import DtelecomIcon from "@/components/icons/dTelecom.svg";

export const PoweredBy = () => {
  return (
    <div className="h-full">
      <a
        target="_blank"
        className="flex sm:flex-row flex-col items-center justify-center h-full"
        rel="noreferrer"
        href="https://app.dtelecom.org"
      >
        <div className="text-xs sm:mr-2 mr-0 flex items-center gap-2">Powered by <DtelecomIcon/></div>
      </a>
    </div>
  );
};
