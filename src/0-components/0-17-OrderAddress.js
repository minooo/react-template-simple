import React from "react";

export default ({ title, caption }) => (
  <div className="plr30 ptb25 bg-white flex mb20">
    <i className="i-address font40 c-main mt15" />
    <div className="pl20 equal">
      <div className="font32 c333 bold mb20">{title}</div>
      <div className="font24 c999">{caption}</div>
    </div>
  </div>
);
