import React, { Component } from "react";
import { Checkbox } from "antd-mobile";
import { Layout, NavBar, WrapLink } from "@components";

// const { alert } = Modal;

export default class extends Component {
  state = {};
  onChange = (val, type) => {
    if (type === "login") {
      const { checked } = val.target;
      console.info(checked);
      this.setState(() => ({ isLongLogin: checked }));
    }
  };
  render() {
    const { isLongLogin } = this.state;
    return (
      <Layout title="支付订单">
        <NavBar title="支付订单" />
        <div className="equal overflow-y">
          <div className="h20" />
          <div className=" flex jc-between ai-center bg-white h88 plr30">
            <div className=" font28 c000">订单金额</div>
            <div className="flex ai-end">
              <div className="font24 c-main">
                ￥<span className=" font34 pl10">1288.00</span>
              </div>
            </div>
          </div>
          <div className="h20" />
          <div className="plr30 bg-white">
            <div className=" border-bottom-one h88 flex ai-center font24 c000">
              选择支付方式
            </div>
            <div className=" ptb30 flex jc-between ai-center">
              <div className="flex ai-center">
                <i style={{ fontSize: "0.7rem" }} className=" i-wechat mr20" />
                <div>
                  <div className=" font24 c000">微信支付</div>
                  <div className=" font20 c999">亿万用户的选择，更快更安全</div>
                </div>
              </div>
              <Checkbox
                className="add-checkbox-rest"
                checked={isLongLogin}
                onChange={val => this.onChange(val, "login")}
              />
            </div>
          </div>
          <div className="h52" />
          <div className="plr30 w-100">
            <WrapLink className=" h80 font30 c-white bg-main r10 flex jc-center ai-center w-100">
              立即支付
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
