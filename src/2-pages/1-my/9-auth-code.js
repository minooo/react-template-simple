import React, { Component } from "react";
import { common, http } from "@utils";
import { Layout, NavBar } from "@components";

const util = require("util");

export default class extends Component {
  static async getInitialProps({ ctx }) {
    // err req res pathname query asPath
    const { asPath, req } = ctx;
    const order_id = common.getUrlLastStr(asPath);
    try {
      const { data } = await http.get(`order/verify/${order_id}`, null, !!req);
      return { data };
    } catch (error) {
      const err = util.inspect(error);
      return { err };
    }
  }
  state = {};
  render() {
    const { data } = this.props;
    return (
      <Layout title="核销码">
        <NavBar title="核销码" />
        <div className="plr30 bg-white">
          <div className="h38" />
          <div className="font24 c333 lh100 ">核销码：</div>
          <div className=" c-main font34 bold mt30 mb30 ">
            {data.status === 11 ? (
              <s>{data.verify_code}</s>
            ) : (
              <span>{data.verify_code}</span>
            )}
          </div>
        </div>
        <div className="h20" />
        <div className="plr30 bg-white ptb30">
          <div style={{ lineHeight: "0.4rem" }} className="font24 c999 ">
            规则说明：<br />
            1、该核销码用于插件核销使用，每个核销码仅可使用一次。<br />
            2、有效期:2018-12-31
          </div>
        </div>
      </Layout>
    );
  }
}
