"use client";

function ErrorMessage({ error }) {
  return (
    <div className="flex justify-center items-center h-[40vh]">
      <p className="text-red-500 text-center">Error: {error}</p>
    </div>
  );
}

export { ErrorMessage };
