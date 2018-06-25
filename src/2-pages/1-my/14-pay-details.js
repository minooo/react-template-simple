import React, { Component } from "react";
import { Layout, NavBar, WrapLink } from "@components";
import { common } from "@utils"

export default class extends Component {
  state = {};
  render() {
    const { id, goods_id, pay_price, buy_type, launch_log_id, isFull } = common.searchToObj()
    return (
      <Layout title="订单支付详情">
        <NavBar title="订单支付详情" />
        <div className="equal overflow-y">
          <div
            style={{ height: "3.62rem" }}
            className=" flex column jc-center ai-center bg-white"
          >
            <i style={{ fontSize: "1rem" }} className="i-tag c-main mb20" />
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
              <div>￥{pay_price}</div>
            </div>
          </div>
          <div className="h72" />
          <div className=" plr30">
            {
              buy_type !== "2" && (
                <WrapLink
                  className="h80 font30 c-white bg-main r10 flex jc-center ai-center w-100 mb30"
                  path={`/details_${launch_log_id}`}
                >
                  {
                    (buy_type === "1" || isFull === "false") ? "邀请好友参团" : "查看本次拼团"
                  }
                </WrapLink>
              )
            }

            <WrapLink
              className="h80 font30 c-white bg-second r10 flex jc-center ai-center w-100"
              path={`/order_details_${id}`}
            >
              查看订单详情
            </WrapLink>
            <div className="h20" />
            <WrapLink className="h80 font30 c333  r10 flex jc-center ai-center w-100" path={`/product_detail_${goods_id}`}>
              继续购买
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
