import React from "react";
import { GeneralMessage } from "../basic/GeneralMessage";
import { useRouter } from "next/navigation";

// Analyte/Compound selection table(one part of the whole component)

function AnalytesTable({ queryCriteria, analytes }) {
  const router = useRouter();

  if (!analytes) return null;

  const handleSelectAnalyte = (analyte) => {
    //print actual object
  console.log("Selected analyte:", analyte); 
  // save the analyte ID
  sessionStorage.setItem("selectedAnalyteId", analyte.analyte_id); 
  router.push(`/method-selection/${analyte.analyte_id}`);
};

  let arr = [];

  if (analytes.message) {
    arr = analytes.message;
  } else {
    arr = analytes;
  }
  if (typeof arr === "object" && !Array.isArray(arr)) {
    arr = Object.values(arr);
  }
  if (!analytes || analytes.message === "No results found") {
    return <GeneralMessage message="No results found" />;
  }

  return (
    <div className="divide-y bg-[#003883] divide-gray-200 shadow-md overflow-hidden min-w-min rounded-md">
      <div className="text-white font-bold flex justify-between">
        <div className="py-2.5 text-left px-6">Analyte Name</div>
        <div className="py-2.5 text-right px-6">CAS #</div>
      </div>
      <div className="bg-white divide-y divide-gray-200">
        {arr.map((analyte, index) => (
  <div
    key={index}
    className="cursor-pointer transition-all hover:scale-[101%] hover:bg-gray-100 duration-300 py-[.8rem] px-[1.5rem] flex flex-wrap justify-between w-full gap-y-[.2rem]"
    onClick={() => handleSelectAnalyte(analyte)}
  >
    {queryCriteria.searchTerm && (
      <p className="w-full text-xs text-enviro_blue_light font-semibold">
        Search results for {analyte.found_in} that contain '
        {queryCriteria.searchTerm}'
      </p>
    )}
    <p className="w-1/2">{analyte.analyte_name}</p>
    <p className="w-1/2 text-right">{analyte.cas_number || "N/A"}</p>
  </div>
))}
      </div>
    </div>
  );
}

export { AnalytesTable };
