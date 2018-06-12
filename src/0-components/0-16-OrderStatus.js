import React from "react";
export default ({ item }) => (
  <div className="ptb40 bg-white flex column ai-center mb20">
    <div
      className={`h100 w100 circle ${item.bg} flex jc-center ai-center mb40`}
    >
      <i className={item.ico} />
    </div>
    <div className="font34 c333 bold lh100">{item.title}</div>
    {item.customCaption ||
      (item.caption ? (
        <div className="font24 c333 lh100 bold-mid mt40">{item.caption}</div>
      ) : null)}
  </div>
);
