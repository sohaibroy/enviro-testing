// "use client";

// import { useEffect, useState } from "react";
// import FetchMethod from "@/app/components/methods/FetchMethod";

// export default function MethodSelectionPage({ params }) {

//   const [analyteId, setAnalyteId] = useState(params.analyteId || null);

// useEffect(() => {
//   console.log("Route analyteId param:", params.analyteId);
// console.log("Session analyteId:", sessionStorage.getItem("selectedAnalyteId"));
//   if (!analyteId) {
//     const stored = sessionStorage.getItem("selectedAnalyteId");
//     if (stored) {
//       setAnalyteId(stored);
//     }
//   }
// }, [analyteId]);

//   if (!analyteId) return <p>Loading analyte...</p>;

//   return <FetchMethod analyteId={analyteId} />;
// }

"use client";

import { useEffect, useState } from "react";
import FetchMethod from "@/app/components/methods/FetchMethod";

export default function MethodSelectionPage({ params }) {
  const [analyteId, setAnalyteId] = useState(null);

  useEffect(() => {
    const paramId = params?.analyteId;

    if (paramId) {
      console.log("Route param analyteId:", paramId);
      sessionStorage.setItem("selectedAnalyteId", paramId);
      setAnalyteId(paramId);
    } else {
      const stored = sessionStorage.getItem("selectedAnalyteId");
      console.log("📦 Fallback session analyteId:", stored);
      if (stored) {
        setAnalyteId(stored);
      }
    }
  }, [params?.analyteId]);

  if (!analyteId) return <p>Loading analyte...</p>;

  return <FetchMethod analyteId={analyteId} />;
}