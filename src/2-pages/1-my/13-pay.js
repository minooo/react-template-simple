import React, { Component } from "react";
import { Checkbox, Toast } from "antd-mobile";
import { Layout, NavBar, WrapLink } from "@components";
import { common, http, wxapi } from "@utils"

// const { alert } = Modal;

export default class extends Component {
  state = { isLongLogin: true };
  componentDidMount() {
    common.setTitle("支付")
    wxapi.setShare({
      title: "标题",
      desc: "副标题",
    })
  }
  onChange = (val, type) => {
    if (type === "login") {
      const { checked } = val.target;
      this.setState(() => ({ isLongLogin: checked }));
    }
  };
  onPay = () => {
    const { history } = this.props
    const { order_id, id, goods_id, pay_price, buy_type } = common.searchToObj()
    http.post({ action: "wxpay", order_id }).then(response => {
      const { errcode, msg, data } = response
      if (errcode === 0) {
        console.info(data, "success")
        const paramsObj = { id, goods_id, pay_price, buy_type, launch_log_id: data.launch_log_id }
        const paramsStr = common.serializeParams(paramsObj)
        // history.push(`/pay_details?${paramsStr}`)
        const pay_param = {
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: "MD5",
          paySign: data.paySign
        }
        console.info("微信支付参数", pay_param)
        wxapi.pay(pay_param).then(() => {
          http.postC({ action: "wxpay_query_order", out_trade_no: data.out_trade_no }, () => {
            history.push(`/pay_details?${paramsStr}`)
          })
        }, (err) => {
          Toast.info(`支付reject错误：${JSON.stringify(err)}`)
        }).catch(err => { Toast.fail(`支付catch错误：${JSON.stringify(err)}`) })
      } else {
        Toast.fail(`wxpay 的错误信息：${msg}`)
      }
    }).catch(error => {
      Toast.offline(`wxpay 的catch信息：${error}`)
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
            <WrapLink
              className={`h80 font30 c-white ${isLongLogin ? "bg-main" : "bg-d9"} bg-main r10 flex jc-center ai-center w-100`}
              onClick={isLongLogin ? this.onPay : null}
            >
              立即支付
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
