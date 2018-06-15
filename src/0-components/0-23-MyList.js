import React from "react";
import { WrapLink } from "@components";

export default ({ as, onClick, extra, children }) => (
  <WrapLink
    path={as}
    onClick={onClick}
    className="flex w-100 ai-center jc-between h88 border-bottom-one"
  >
    {children}
    <div className=" flex ai-center">
      {extra && <div className=" font24 c999 lh100 mr20">{extra}</div>}
      <i className=" i-right c999 font20" />
    </div>
  </WrapLink>
);
