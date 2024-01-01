import React from "react";

const Search = ({searchTerm,onChange,onClick}) => {
  return (
    <div className="bg-transparent relative w-[50%] px-4 py-4 rounded-md ml-4">
      <input
        className="w-full px-2 py-4 rounded-xl bg-gray-700 text-white outline-none"
        placeholder="Search by trxId/trx hashes or address"
        value={searchTerm}
        onChange={(e)=>onChange(e.target.value)}
      />
      <button onClick={onClick} className="bg-blue-500 px-4 py-2 absolute right-4 top-6 text-white tracking-wider rounded-xl mr-2">Search</button>
    </div>
  );
};

export default Search;
