import React, { Component } from "react";
import { Checkbox, Toast, Button } from "antd-mobile";
import { Layout, NavBar, WrapLink } from "@components";
import { common, http, wxapi } from "@utils"

export default class extends Component {
  state = { isLongLogin: true };
  componentWillUnmount() {
    Toast.hide()
  }
  onChange = (val, type) => {
    if (type === "login") {
      const { checked } = val.target;
      this.setState(() => ({ isLongLogin: checked }));
    }
  };
  onPay = () => {
    const { history } = this.props
    const { order_id, id, goods_id, pay_price, buy_type, isFull } = common.searchToObj()
    http.post({ action: "wxpay", order_id }).then(response => {
      const { errcode, msg, data } = response
      if (errcode === 0) {
        const paramsObj = { id, goods_id, pay_price, buy_type, launch_log_id: data.launch_log_id, isFull }
        const paramsStr = common.serializeParams(paramsObj)
        // history.push(`/pay_details?${paramsStr}`)
        const pay_param = {
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign
        }
        wxapi.pay(pay_param).then(() => {
          Toast.loading("订单处理中，请稍后...", 60)
          http.postC({ action: "wxpay_query_order", out_trade_no: data.out_trade_no }, () => {
            history.push(`/pay_details?${paramsStr}`)
          })
        }, (err) => {
          Toast.info(`抱歉，支付 reject 错误：${JSON.stringify(err)}`)
        }).catch(err => { Toast.fail(`抱歉，支付 catch 错误：${JSON.stringify(err)}`) })
      } else {
        // 订单过期 回到订单详情中
        Toast.fail(msg, 1, () => history.replace(`/order_details_${data.id}`))
      }
    }).catch(error => {
      Toast.offline(error, 1, () => history.replace("/"))
    })
  }
  cancleOrder= () => {
    const { history } = this.props;
    history.replace("/order_list")
  }
  render() {
    const { isLongLogin } = this.state;
    const { pay_price } = common.searchToObj()
    return (
      <Layout title="支付订单">
        <NavBar
          title="支付订单"
          rightCon={
          <WrapLink onClick={this.cancleOrder} className="equal-auto text-right c-white">
            取消
          </WrapLink>}
        />
        <div className="equal overflow-y">
          <div className="h20" />
          <div className=" flex jc-between ai-center bg-white h88 plr30">
            <div className=" font28 c000">订单金额</div>
            <div className="flex ai-end">
              <div className="font28 c-main">
                ￥<span className=" font34 pl10">{pay_price}</span>
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
                  <div className=" font24 c000 mb10">微信支付</div>
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
            <Button type="primary" disabled={!isLongLogin} onClick={this.onPay}>立即支付</Button>
          </div>
        </div>
      </Layout>
    );
  }
}
