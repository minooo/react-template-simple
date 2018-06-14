import React from "react";
import { HideImg } from "@components";

export default ({ id, places, status, surplusTime, offerd_num, fans }) => (
  <div className=" plr30 bg-white">
    <div className="h40" />
    <div className=" flex column ai-center">
      {/* 剩余时间 */}
      {status === 2 || places === 0 ? (
        <div className="font30 c333 mb30 lh100">此拼单已满员!</div>
      ) : (
        <div className=" font30 c333 lh100 mb30">
          {surplusTime
            ? surplusTime.getdays > 0
              ? `剩余时间 ${surplusTime.getdays}天 后结束`
              : `剩余时间 ${surplusTime.getHours}:${surplusTime.getMinutes}:${
                  surplusTime.getSeconds
                } 后结束`
            : "拼单时间到，未达到拼单人数"}
        </div>
      )}
      {/* 头像显示 */}
      <div className="flex jc-center">
        <HideImg
          imgList={fans}
          imgSize={90}
          teamId={id}
          margin={0.2}
          teaming
          team
        />
      </div>
      <div className="h60 w-100" />
      <div className=" font28 c333 lh100">
        <span className=" c-main ">{offerd_num}人团</span>·拼单{surplusTime &&
        status === 1
          ? "中"
          : (surplusTime && status === 2) || (!surplusTime && status === 2)
            ? "完成"
            : "失败"}
      </div>
      <div className="h50  w-100" />
    </div>
  </div>
);
