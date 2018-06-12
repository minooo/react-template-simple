import React from "react";
import { WrapLink, HideImg } from "@components";

const fans = [
  {
    nickname: "L",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
  },
  {
    nickname: "L",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
  },
  {
    nickname: "L",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
  },
  {
    nickname: "L",
    headimgurl:
      "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
  }
];

export default () => (
  <div className=" plr30 bg-white">
    <div className="h40" />
    <div className=" flex column ai-center">
      <div className=" font30 c333 lh100 mb30">
        仅剩<span className=" c-main bold"> 1 </span>个名额，23:55:53 后结束
      </div>
      <div className="flex jc-center">
        <HideImg
          imgList={fans}
          imgSize={90}
          teamId={1}
          margin={0.20}
          teaming
          team
        />
        {/* <div className=" relative">
          <img
            className=" circle w90 h90 mr20"
            src="/static/images/my_logo.png"
            alt=""
          />
          <div
            style={{
              borderRadius: "0.16rem",
              left: "0.15rem",
              bottom: "-0.2rem",
              padding: "0.05rem 0.07rem"
            }}
            className=" bg-main font24 c-white text-center absolute"
          >
            团长
          </div>
        </div>
        <img
          className=" circle w90 h90"
          src="/static/images/my_logo.png"
          alt=""
        /> */}
      </div>

      <div className="h60" />
      <div className=" font28 c333 lh100">
        <span className=" c-main ">2人团</span>·拼单中
      </div>
      <div className="h50 " />
      <WrapLink className=" r10 h80 bg-main c-white font30 w-100">
        邀请好友
      </WrapLink>
      <div className="h40" />
      <WrapLink className=" font24 c666 ">查看订单详情</WrapLink>
      <div className="h40" />
    </div>
  </div>
);
