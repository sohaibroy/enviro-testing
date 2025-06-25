import React from 'react';
import Link from 'next/link';

const MethodCardList = ({ methods, analyte }) => {
  if (!methods || !methods.length) return null;

  return (
    <>
      {methods.map((method, index) => (
        <div key={`${method.analyte_id}-${index}`} className="w-[20rem]  shadow-lg transition-all hover:scale-[101%] hover:translate-y-[-.5rem]">
          <div className="py-4 px-6 flex-grow drop-shadow-sm">
          <h1 className="text-xl text-right font-bold mb-4">{analyte.analyte_name}</h1>
            <h2 className="font-semibold  mb-4">{method.method_name}</h2>
            <p className="mb-2">Matrix: {method.matrix}</p>
            <p className="mb-2">Media: {method.media}</p>
            <p className="mb-2">Measurement: {method.measurement}</p>
            <p className="mb-2">Sample Rate: {method.sample_rate}</p>
            <p className="mb-4">Limit of Quantification: {method.limit_of_quantification}</p>
          </div>
          <div className="bg-white">
            <Link href={`/method-selection/${method.analyte_id}/quantity/${method.method_id}`} passHref>
               <button
                 className="w-full bg-[#ee7d11] p-2 text-white hover:transition-all hover:scale-[101%]">
                  Select Method
               </button>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default MethodCardList;
