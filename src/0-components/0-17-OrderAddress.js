import React from "react";

export default ({ nickname, mobile, address }) => (
  <div className="plr30 ptb25 bg-white flex mb20">
    <i className="i-address font40 c-main mt15" />
    <div className="pl20 equal">
      <div className="font32 c333 mb20"> <span className="bold">{nickname}</span><span className="pl20">{mobile}</span> </div>
      <div className="font24 c999">{address}</div>
    </div>
  </div>
);
