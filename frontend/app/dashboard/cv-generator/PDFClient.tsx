/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFViewer, pdf } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";
import { useEffect, useState } from "react";

export default function PDFClient({ data }: any) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(check);
  }, []);

  // 🚀 BEST: Open PDF in new tab (works on mobile)
  const handleOpenPDF = async () => {
    const blob = await pdf(<MyDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url); // 📱 opens in browser viewer
  };

  // 📱 MOBILE UI
  if (isMobile) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Your CV is ready</h2>

        <button
          onClick={handleOpenPDF}
          style={{
            padding: "10px 16px",
            background: "black",
            color: "white",
            borderRadius: 6,
          }}
        >
          Open CV
        </button>
      </div>
    );
  }

  // 💻 DESKTOP UI
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <MyDocument data={data} />
    </PDFViewer>
  );
}
