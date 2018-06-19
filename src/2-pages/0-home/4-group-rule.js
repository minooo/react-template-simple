import React, { Component } from "react";
import { Layout, NavBar } from "@components";

export default class extends Component {
  state = {};

  render() {
    return (
      <Layout title="拼单规则">
        <NavBar title="拼单规则" />
        <div className="equal overflow-y">
          <div className="plr30 bg-white ptb30">
            <div className=" font34 bold pb30 text-center">拼团规则</div>
            <div className="font28 pb30" style={{ lineHeight: "200%" }}>
              <div className="pb20">
                用户参与拼团活动，开团成为团长，并邀请用户参团，在规定时间内参团人数达到限定人数，即组团成功，抱团商品进入发货流程。组团次数不限，商品售完为止。
              </div>
              <div className="pb20">
                如在开团后规定时间内，参团人数未达到限定人数，或成团前库存售罄，则组团失败。系统自动取消订单，并全额退款，微信零钱将原路返回至您的账户。可在订单中心查看退款详情。
              </div>
              <div className="pb20">
                参与抱团的商品若在收到货品后申请退款，则不退回邮费，只退支付的商品费用。
              </div>
              <div className="pb20">
                如存在违规行为（包括但不限于恶意购买、机器作弊），平台将取消参与资格。
              </div>
              <div>嘟嘟拼团可在法律允许范围内对本次活动规则进行解释。</div>
            </div>
            <div className=" font34 bold pb30 text-center">常见问题</div>
            <div className="font28" style={{ lineHeight: "200%" }}>
              <div className="pb10">
                如果我付款不成功，要怎么找到我的团购商品付款呢？
              </div>
              <div className="pb20">
                点击首页订单入口进入订单中心，查看未付款订单，即可继续付款。
              </div>
              <div className="pb10">
                如果我发起了一次团购超时了，还能发起拼团么？
              </div>
              <div>
                在规定时间内未抱团成功的，可再次点击重新开团，继续购买哦~
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
