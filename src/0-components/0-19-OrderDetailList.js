import React from "react";

export default ({ item, onClick }) => (
  <div
    className="h86 flex jc-between ai-center border-bottom font26 c333"
    onClick={item.type ? onClick : null}
  >
    <span>{item.title}</span>
    { item.type ? <i className="i-right c999 font24" /> : <span>{item.caption}</span> }
  </div>
);
