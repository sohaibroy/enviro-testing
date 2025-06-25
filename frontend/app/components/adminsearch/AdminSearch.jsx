"use client";

import { FaSearch } from "react-icons/fa";

function AdminSearch({ onSearch, searchTerm, setSearchTerm, placeholder }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      onSearch();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="bg-enviro_orange p-[.1rem] flex-1">
      <form
        className="flex justify-between w-full m-auto shadow-2xl"
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          className="bg-white w-full px-[1rem] flex-grow"
          type="text"
          name="keywords"
          placeholder={placeholder || "Search"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        <button
          className="bg-[#ee7d11] p-2 w-[4rem] h-[2.5rem] text-white shadow-2xl font-bold transition-all hover:scale-[105%]"
          type="submit"
        >
          <FaSearch className="m-auto" size={20} />
        </button>
      </form>
    </div>
  );
}

export { AdminSearch };
