"use client";

import { FaSearch } from "react-icons/fa";
//Analyte search bar (one component of the whole analyte component)

function Search({
  onSearch,
  searchTerm,
  searchType,
  setSearchTerm,
  setSearchType,
  placeholder,
}) {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    onSearch(); // Call the onSearch function passed as a prop
  };

  return (
    <div className="border-2 border-enviro_orange flex-1 rounded-md overflow-hidden">
      <form
        className="flex justify-between w-full m-auto shadow-2xl"
        method="POST"
        onSubmit={handleSubmit}
      >
        <select
          name="search_field"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="bg-gray-50 px-[1rem] font-semibold text-gray-600 border-r-[.1rem] border-gray-300 hover:bg-gray-100 hover:cursor-pointer"
        >
          <option value="Contains">Contains</option>
          <option value="Exact">Exact</option>
        </select>
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

export default Search;

export { Search };
