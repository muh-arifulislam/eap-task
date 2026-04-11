/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

export default function PDFClient({ data }: any) {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <MyDocument data={data} />
    </PDFViewer>
  );
}
