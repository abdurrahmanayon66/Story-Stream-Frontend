"use client"
import React from "react";
import { IoIosSearch } from "react-icons/io";

const CustomSearch = () => {
  return (
    <div>
      <label className="input input-bordered flex items-center gap-4 w-[80%] bg-white shadow-xl px-2 relative">
        <IoIosSearch className="text-4xl bg-white font-semibold text-purple-400" />
        <input
          type="text"
          className="text-black bg-white w-full font-semibold focus:outline-none placeholder:text-slate-500"
          placeholder="Search Article"
        />
        <button className="bg-purple-400 w-[30%] rounded-lg text-white h-10" disabled>
          Search
        </button>
      </label>
    </div>
  );
};

export default CustomSearch;
