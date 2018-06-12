import React, { Component } from "react";
import { Layout, NavBar, WrapLink } from "@components";

export default class extends Component {
  state = {};
  render() {
    return (
      <Layout title="订单支付详情">
        <NavBar title="订单支付详情" />
        <div className="equal overflow-y">
          <div
            style={{ height: "3.62rem" }}
            className=" flex column jc-center ai-center bg-white"
          >
            <i style={{ fontSize: "1rem" }} className="i-tag c-main" />
            <div>支付成功</div>
          </div>
          <div className=" h20" />
          <div className=" plr30 bg-white">
            <div className=" flex jc-between ai-center h88 border-bottom-one font28 c000">
              <div>支付方式</div>
              <div>微信支付</div>
            </div>
            <div className=" flex jc-between ai-center h88 font28 c000">
              <div>支付金额</div>
              <div>￥2000.00</div>
            </div>
          </div>
          <div className="h72" />
          <div className=" plr30">
            <WrapLink className=" h80 font30 c-white bg-main r10 flex jc-center ai-center w-100 mb30">
            邀请好友参团
            </WrapLink>
            <WrapLink className=" h80 font30 c-white bg-second r10 flex jc-center ai-center w-100">
            查看订单详情
            </WrapLink>
            <div className="h40" />
            <WrapLink className=" font28 c333 w-100">
            继续购买
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
