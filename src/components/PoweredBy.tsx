import React, {CSSProperties} from "react";
import DtelecomIcon from "@/components/icons/dTelecom.svg";
import {useMobile} from "@/util/useMobile";

export const PoweredBy = () => {
  const isMobile = useMobile();

  const style: CSSProperties = isMobile ? {
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: '#777575',
    gap: '4px',
    lineHeight: '100%'
  } : {};

  return (
    <a
      target="_blank"
      className="flex sm:flex-row flex-col items-center justify-center"
      rel="noreferrer"
      href="https://dtelecom.org"
    >
      <div
        className="text-xs sm:mr-2 mr-0 flex items-center gap-2"
        style={style}
      >Powered
        by <DtelecomIcon/></div>
    </a>
  );
};
