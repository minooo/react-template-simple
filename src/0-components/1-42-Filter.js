import React from "react";

export default ({ focusId, filters, onFilterClick }) => (
  <div className="flex jc-around h90 border-bottom-one bg-white">
    {filters.map((item, index) => (
      <button
       /* eslint-disable */
        key={index}
        className={`plr20 common-transition ${
          focusId === item.id
            ? "home-filter-active c-main blod font30"
            : "c000 font28"
        }`}
        onClick={() => onFilterClick(item)}
      >
        {item.title}
      </button>
    ))}
  </div>
);
