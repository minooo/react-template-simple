import React from "react";
import { WrapLink } from "@components";

export default ({ href, as, onClick, extra, children }) => (
  <WrapLink
    path={as}
    onClick={onClick}
    className="flex w-100 ai-center jc-between h88 border-bottom-one"
  >
    {children}
    <div className=" flex ai-center">
      {extra && <div className=" font24 c999 lh100 mr20">{extra}</div>}
    </div>
  </WrapLink>
);
