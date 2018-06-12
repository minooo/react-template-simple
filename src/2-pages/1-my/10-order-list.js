/* eslint-disable */
import React, { Component } from "react";
import { Toast, Modal } from "antd-mobile";
import { http } from "@utils";
import { Layout, NavBar, HomeMyTeambuyList, WrapLink } from "@components";

const { alert } = Modal;
const commonAlert = (text, handle) =>
  alert(`确定要${text}吗？`, "", [
    { text: "取消" },
    { text: "确定", onPress: handle }
  ]);

export default class extends Component {
  state = {
    list: [
      { id: 1, order_id: 1213454566, goods_id: 1, status: 0, status_val: "待支付", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 2, order_id: 1213454566, goods_id: 2, status: 1, status_val: "确认中", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 1 },
      { id: 3, order_id: 1213454566, goods_id: 3, status: 2, status_val: "已支付", delivery_type: 1, thumb: "", title: "邮寄类", pay_price: 12344, buy_num: 3 },
      { id: 33, order_id: 1213454566, goods_id: 4, status: 2, status_val: "已支付", delivery_type: 2, thumb: "", title: "核销类", pay_price: 12344, verify_code: 22233 },
      { id: 4, order_id: 1213454566, goods_id: 5, status: 3, status_val: "交易关闭", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 5, order_id: 1213454566, goods_id: 6, status: 4, status_val: "支付失败", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 6, order_id: 1213454566, goods_id: 7, status: 5, status_val: "卖家已发货", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 66, order_id: 1213454566, goods_id: 8, status: 6, status_val: "买家确认收货", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 7, order_id: 1213454566, goods_id: 9, status: 7, status_val: "买家申请退货", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 8, order_id: 1213454566, goods_id: 10, status: 8, status_val: "卖家同意退货", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 9, order_id: 1213454566, goods_id: 11, status: 9, status_val: "卖家拒绝退货", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 91, order_id: 1213454566, goods_id: 12, status: 10, status_val: "买家确认退货", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 92, order_id: 1213454566, goods_id: 13, status: 11, status_val: "已核销", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 93, order_id: 1213454566, goods_id: 14, status: 12, status_val: "无货退款", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
      { id: 94, order_id: 1213454566, goods_id: 15, status: 13, status_val: "交易已完成", thumb: "", title: "手动阀", pay_price: 12344, buy_num: 3 },
    ]
  };
  handle = (type, item) => {
    switch (type) {
      case "delOrder": // 删除订单
        commonAlert("删除订单", () => {
          console.info("删除订单的逻辑。。。")
        });
        break;
      case "goPay": // 去支付
        // Router.push("/1-my/11-order-details", `/my/order/${item.id}`);
        break;
      case "returnGoods": // 申请退货
        commonAlert("申请退货", () => {
          console.info("申请退货的逻辑。。。")
        });
        break;
      case "checkCode": // 查看核销码
        alert("核销码", item.verify_code, [
          { text: "确定" },
        ]);
        break;
      case "confirmReceipt": // 确认收货
        commonAlert("确认收货", () => {
          console.info("确认收货的逻辑。。。")
        });
        break;
      case "goComment": // 去评价
        // Router.push("/1-my/8-write-comment", `/my/writeComment/${item.id}`)
        break;
      case "backGoods": // 退还商品
        commonAlert("退还商品", () => {
          console.info("退还商品的逻辑。。。")
        });
        break;
      case "tipReceipt": // 提醒商家收货
        commonAlert("提醒商家收货", () => {
          console.info("提醒商家收货的逻辑。。。")
        });
        break;
      case "finishOrder": // 完成交易
        commonAlert("完成交易", () => {
          console.info("完成交易的逻辑。。。")
        });
        break;
      default:
        console.info("nothing")
    }
  }
  componentDidMount() {
    console.info(this.props, "pp")
  }
  render() {
    const { list } = this.state;
    return (
      <Layout title="商品订单">
        <NavBar title="商品订单" />
        {/* 拼团订单按钮 */}
        <WrapLink
          className="flex column jc-center ai-center c-white bg-main circle home-order-btn"
          href="/1-my/0-home"
          as="/my"
        >
          <i className="font40 i-group font40 mb10" />
          <span className="font24">拼团订单</span>
        </WrapLink>
        {/* 列表 */}
        <div className="equal overflow-y">
          {list &&
            list.length &&
            list.map(item => (
              <HomeMyTeambuyList
                key={item.id}
                item={item}
                handle={this.handle}
              />
            ))}
        </div>
      </Layout>
    );
  }
}
