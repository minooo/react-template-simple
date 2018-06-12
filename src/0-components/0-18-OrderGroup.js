import React from "react";
import { WrapLink } from "@components"

export default ({ members, groupId }) => (
  <div className="plr30 mb20 bg-white">
    <div className="h94 border-bottom-one flex ai-center">
      <i className="i-group font34 c999 mr10" />
      <div className="font28 c333">拼单成功</div>
    </div>
    <div className="h110 flex jc-between ai-center">
      <div>haha{members}</div>
      <WrapLink className="w150 h50 r10 border-default flex jc-center ai-center font24 c999" path={`/my/details/${groupId}`}>拼单详情</WrapLink>
    </div>
  </div>
);
