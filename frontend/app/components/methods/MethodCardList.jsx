import React from 'react';

const MethodCardList = ({ method, analyte, onSelectMethod }) => {
  if (!method || !analyte) return null;

  return (
    <div className="w-full max-w-[20rem] flex flex-col justify-between h-full min-h-[26rem] shadow-lg transition-all hover:scale-[101%] hover:translate-y-[-.5rem] rounded-lg overflow-hidden bg-white">
      <div className="py-4 px-6 flex-grow">
        <h1 className="text-xl text-center font-bold mb-4">
          {analyte.analyte_name}
        </h1>
        <h2 className="font-semibold mb-4">{method.method_name}</h2>
        <p className="mb-2">Matrix: {method.matrix}</p>
        <p className="mb-2">Media: {method.media}</p>
        <p className="mb-2">Measurement: {method.measurement}</p>
        <p className="mb-2">Sample Rate: {method.sample_rate}</p>
        <p className="mb-4">
          Limit of Quantification: {method.limit_of_quantification}
        </p>
      </div>

      <div className="bg-white mt-auto">
        <button
          className="w-full bg-[#ee7d11] p-2 text-white hover:scale-[101%] transition-all"
          onClick={() => onSelectMethod(method)}
        >
          Select Method
        </button>
      </div>
    </div>
  );
};

export default MethodCardList;
