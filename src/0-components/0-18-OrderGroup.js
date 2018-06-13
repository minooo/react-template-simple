import React from "react";
import { WrapLink, HideImg } from "@components";

export default ({ status, list, groupId }) => (
  <div className="plr30 mb20 bg-white">
    <div className="h94 border-bottom-one flex ai-center">
      <i className="i-group font34 c999 mr10" />
      <div className="font28 c333">
        {status === 1
          ? "拼团中"
          : status === 2
            ? "拼团成功"
            : "拼团失败"}
      </div>
    </div>
    <div className="h110 flex jc-between ai-center">
      <HideImg imgList={list} imgSize={50} margin={-0.1} teamId={groupId} />
      <WrapLink
        className="w150 h50 r10 border-default flex jc-center ai-center font24 c999"
        path={`/details_${groupId}`}
      >
        拼单详情
      </WrapLink>
    </div>
  </div>
);
