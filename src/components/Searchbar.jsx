import React from "react";
import "../styles/searchbar.css";

export default function Searchbar({ searchItem, setSearchItem }) {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for a job"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
      />
    </div>
  );
}
