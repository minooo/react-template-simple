import React from "react";
import uuid from "uuid/v4";

export default ({ items }) => (
  <div className=" flex wrap jc-between mb30">
    {Array(...Array(6)).map((item, index) => {
      if (items[index]) {
        return <img key={uuid()} className="w90 h90 circle" src={items[index].avatar} alt="" />;
      }
      return <div key={uuid()} className="w90 h90" />;
    })}
  </div>
);
