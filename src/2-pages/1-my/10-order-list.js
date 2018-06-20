import React, { Component } from "react";
import { Toast, Modal } from "antd-mobile";
import { http, common } from "@utils";
import {
  Layout,
  NavBar,
  HomeMyTeambuyList,
  WrapLink,
  ScrollLoad
} from "@components";

const { alert } = Modal;
const commonAlert = (text, handle) =>
  alert(`确定要${text}吗？`, "", [
    { text: "取消" },
    { text: "确定", onPress: handle }
  ]);

export default class extends Component {
  state = {
    dataUpdata: false
  };
  handle = (type, item) => {
    const { history } = this.props;
    const payState = {
      good_id: item.goods_id,
      id: item.id,
      order_id: item.order_id,
      pay_price: item.pay_price,
      type: item.buy_type
    };
    const payStr = common.serializeParams(payState);
    switch (type) {
      case "delOrder": // 删除订单
        commonAlert("删除订单", () => {
          this.deleOrder(item.id);
        });
        break;
      case "goPay": // 去支付
        history.push(`/pay?${payStr}`);
        break;
      case "returnGoods": // 申请退货
        history.push(`/retreat_${item.order_id}`);
        break;
      case "checkCode": // 查看核销码
        alert("核销码", item.verify_code, [{ text: "确定" }]);
        break;
      case "confirmReceipt": // 确认收货
        commonAlert("确认收货", () => {
          this.upOrder(item.id, 6, "已确认收货");
        });
        break;
      case "goComment": // 去评价
        history.push(`/write_comment_${item.id}?type=1`);
        break;
      case "backGoods": // 退还商品
        history.push(`logistics_${item.order_id}`);
        break;
      case "tipReceipt": // 提醒商家收货
        Toast.info("已提醒商家收货", 2);
        break;
      case "finishOrder": // 完成交易
        this.upOrder(item.id, 10, "已完成交易");
        break;
      default:
        console.info("nothing");
    }
  };
  // 删除订单
  deleOrder = id => {
    http.deleteC({ action: "order", operation: "destroy", id }, () => {
      Toast.info("删除成功", 1, () =>
        this.setState(pre => ({
          dataUpdata: !pre.dataUpdata
        }))
      );
    });
  };
  // 更新订单状态
  upOrder = (id, status, text) => {
    http.putC(
      {
        action: "order",
        operation: "update",
        id,
        status
      },
      () => {
        Toast.info(text, 1);
        this.setState(pre => ({
          dataUpdata: !pre.dataUpdata
        }));
      }
    );
  };
  renderItem = item => (
    <HomeMyTeambuyList key={item.id} item={item} handle={this.handle} />
  );

  render() {
    const { dataUpdata } = this.state;
    return (
      <Layout title="商品订单">
        <NavBar title="商品订单" />
        {/* 拼团订单按钮 */}
        <WrapLink
          className="flex column jc-center ai-center c-white bg-main circle home-order-btn"
          path="/my"
        >
          <i className="font40 i-group font40 mb10" />
          <span className="font24">我的拼团</span>
        </WrapLink>
        {/* 列表 */}
        <div className="equal overflow-y">
          <ScrollLoad
            dataParam={{ action: "order", operation: "list" }}
            renderItem={this.renderItem}
            forceUpdate={dataUpdata}
          />
        </div>
      </Layout>
    );
  }
}
