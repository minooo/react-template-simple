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
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.btnMove = this.btnMove.bind(this)
  }
  state = {
    dataUpdata: false
  };
  componentDidMount() {
    // touchstart,touchmove ,touchend
    const allWidth = document.body.offsetWidth;
    const allHeight = document.body.offsetHeight;
    const width = this.myRef.current.offsetWidth;
    const height = this.myRef.current.offsetHeight;
    const mixLeft = width / 2;
    const maxLeft = allWidth - (width / 2);
    const mixTop = height / 2;
    const maxTop = allHeight - (height / 2);
    this.myRef.current.removeEventListener("touchmove", this.btnMove);
    this.myRef.current.addEventListener(
      "touchmove",
      this.btnMove(mixLeft, maxLeft, mixTop, maxTop, width, height),
      false
    );
  }
  // 移除监听事件
  componentWillUnmount() {
    this.myRef.current.removeEventListener("touchmove", this.btnMove);
  }
  // 按钮滑动事件
  btnMove = (mixLeft, maxLeft, mixTop, maxTop, width, height) =>
    e => {
      e.preventDefault();
      const { pageX, pageY } = e.changedTouches[0];
      if (
        pageX > mixLeft &&
        pageX < maxLeft &&
        pageY > mixTop &&
        pageY < maxTop
      ) {
        this.myRef.current.style.left = `${pageX - (width / 2)}px`;
        this.myRef.current.style.top = `${pageY - (height / 2)}px`;
      }
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
        if (item.delivery_type === 2 || item.status === 2) {
          history.push(`/retreat_${item.order_id}?type=2`);
        } else {
          history.push(`/retreat_${item.order_id}?type=1`);
        }
        break;
      case "checkCode": // 查看核销码
        this.lookCheckCode(item);
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
      this.setState(pre => ({
        dataUpdata: !pre.dataUpdata
      }));
      Toast.info("删除成功", 1);
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
  lookCheckCode = item => {
    alert(item.verify_code ? "核销码" : "", item.verify_code || "拼单未满员或拼团失败，待拼单成功后才能查看核销码哦~", [{ text: "确定" }]);
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
        <div className="c-white bg-main home-order-btn circle" ref={this.myRef}>
          <WrapLink
            className="w-100 h-100 flex column jc-center ai-center "
            path="/my"
          >
            <i className="font40 i-group font40 mb10" />
            <span className="font24">我的拼团</span>
          </WrapLink>
        </div>
        {/* 列表 */}
        <ScrollLoad
          dataParam={{ action: "order", operation: "list" }}
          renderItem={this.renderItem}
          forceUpdate={dataUpdata}
        />
      </Layout>
    );
  }
}
