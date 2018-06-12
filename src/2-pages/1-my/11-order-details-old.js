import React, { Component } from "react";
import uuid from "uuid/v4";
import { parse } from "date-fns";
import { common } from "@utils";
import { Toast, Modal } from "antd-mobile";
import { Layout, NavBar, WrapLink, List } from "@components";

const { alert } = Modal;
const { countDown } = common;
export default class extends Component {
  state = {
    data: {
      status: 0,
      shopname: "按实际到货即可撒谎的库萨克",
      address: "哇倒萨倒萨角度来讲撒孔家店了",
      details: {
        thumb: "https://dummyimage.com/600x400",
        title: "title",
        price: 123,
        count: 12
      },
      freight: 24,
      price: 123,
      message: "友军模拟盘",
      order_id: "213123213213213",
      creat_time: "2018-01-3 14:24:36",
      on_time: "2018-05-30 18:24:36",
      is_expire: true,
      pay_time: "2018-05-30 14:24:36",
      pay_num: 123,
      pay_type: "微信",
      shipments_time: "2018-05-30 14:24:36",
      shipments_type: "顺丰",
      shipments_id: "2342423432423",
      return_apply_time: "2018-05-30 14:24:36",
      return_cause: "太贵",
      agree_time: "2018-05-30 14:24:36",
      return_time: "2018-05-30 14:24:36",
      return_type: "顺丰",
      return_id: "2342423432423",
      over_time: "2018-05-30 14:24:36"
    },
    surplusTime: ""
  };
  componentDidMount() {
    const { is_expire, status } = this.state.data;
    if (is_expire && status === 0) {
      const upDateParse = parse(this.state.data.on_time);
      this.interval = setInterval(
        () => this.timeUpdate(upDateParse, this.interval),
        1000
      );
    }
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  getData = () => {
    // ...
  };
  timeUpdate = (upDateParse, interval) => {
    this.setState(() => ({
      surplusTime: countDown(upDateParse, interval)
    }));
    if (!this.state.surplusTime) {
      this.getData();
    }
  };
  backStatus = (status, species, id) => {
    const { surplusTime } = this.state;
    switch (status) {
      case 0:
        return {
          text: "未支付",
          icon: <i className="i-clock c-second" style={{ fontSize: "1rem" }} />,
          supplement: (
            <div>
              等待买家付款{" "}
              <span className=" c-main">
                {surplusTime.getHours}:{surplusTime.getMinutes}:{
                  surplusTime.getSeconds
                }
              </span>
            </div>
          ),
          button: (
            <div className="flex equal">
              <WrapLink
                onClick={() =>
                  alert("确定要删除此订单吗？", "", [
                    { text: "取消" },
                    { text: "确定", onPress: () => this.deleteOrder(id) }
                  ])
                }
                className="bg equal bg-second flex ai-center jc-center font30 c-white"
              >
                删除
              </WrapLink>
              <WrapLink
                onClick={() => this.goPay(id)}
                className="equal bg-main flex ai-center jc-center font30 c-white"
              >
                去支付
              </WrapLink>
            </div>
          )
        };
      case 1:
        return {
          text: "支付确认中",
          icon: (
            <i
              className="i-clock"
              style={{ color: "#d9d9d9", fontSize: "1rem" }}
            />
          ),
          supplement: "等待确认支付完成",
          button: (
            <div className="flex equal">
              <div
                className="equal flex ai-center jc-center font30 c666"
                style={{ backgoroundColor: "#d9d9d9" }}
              >
                等待确认支付完成
              </div>
            </div>
          )
        };
      case 2:
        return {
          text: "买家已付款",
          icon: <i className="i-tag c-main" style={{ fontSize: "1rem" }} />,
          supplement: "",
          button: (
            <div className="flex equal">
              {species === 1 ? (
                <WrapLink
                  href="/1-my/6-retreat"
                  as={`/my/retreat/${id}`}
                  className="equal bg-second flex ai-center jc-center font30 c-white"
                >
                  申请退货
                </WrapLink>
              ) : (
                <WrapLink
                  href="/1-my/9-auth-code"
                  as={`/my/authcode/${id}`}
                  className="equal bg-second flex ai-center jc-center font30 c-white"
                >
                  查看核销码
                </WrapLink>
              )}
            </div>
          )
        };
      case 3:
        return {
          text: "交易关闭",
          icon: (
            <i
              className="i-fail"
              style={{ color: "#d9d9d9", fontSize: "1rem" }}
            />
          ),
          supplement: "无货退款",
          button: (
            <div className="flex equal">
              <WrapLink
                onClick={() =>
                  alert("确定要删除此订单吗？", "", [
                    { text: "取消" },
                    { text: "确定", onPress: () => this.deleteOrder(id) }
                  ])
                }
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                删除订单
              </WrapLink>
            </div>
          )
        };
      case 4:
        return {
          text: "支付失败",
          icon: "",
          supplement: "",
          button: ""
        };
      case 5:
        return {
          text: "卖家已发货",
          icon: <i className="i-out c-main" style={{ fontSize: "1rem" }} />,
          supplement: "等待买家确认收货",
          button: (
            <div className="flex equal">
              <WrapLink
                onClick={() =>
                  alert("你是否已收到该订单商品", "", [
                    { text: "取消" },
                    { text: "确定", onPress: () => this.confirmGood(id) }
                  ])
                }
                className="equal bg-main flex ai-center jc-center font30 c-white"
              >
                确认收货
              </WrapLink>
            </div>
          )
        };
      case 6:
        return {
          text: "交易完成",
          icon: (
            <i className="i-completed c-main" style={{ fontSize: "1rem" }} />
          ),
          supplement: "卖家已确认收货",
          button: (
            <div className="flex equal">
              <WrapLink
                href="/1-my/6-retreat"
                as={`/my/retreat/${id}`}
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                申请退货
              </WrapLink>

              <WrapLink
                href="/1-my/8-write-comment"
                as={`/my/writeComment/${id}`}
                className="equal bg-main flex ai-center jc-center font30 c-white"
              >
                评价
              </WrapLink>
            </div>
          )
        };
      case 7:
        return {
          text: "买家申请退货",
          icon: (
            <i
              className="i-clock"
              style={{ color: "#d9d9d9", fontSize: "1rem" }}
            />
          ),
          supplement: "等待卖家同意退货",
          button: (
            <div className="flex equal">
              <div
                className="equal flex ai-center jc-center font30 c666"
                style={{ backgoroundColor: "#d9d9d9" }}
              >
                等待卖家同意退货
              </div>
            </div>
          )
        };
      case 8:
        return {
          text: "卖家同意退货",
          icon: <i className="i-back c-second" style={{ fontSize: "1rem" }} />,
          supplement: "等待买家退还商品",
          button: (
            <div className="flex equal">
              <WrapLink
                href="/1-my/7-logistics"
                as={`/my/logistics/${id}`}
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                退还商品
              </WrapLink>
            </div>
          )
        };
      case 9:
        return {
          text: "卖家拒绝退货",
          icon: (
            <i
              className="i-fail"
              style={{ color: "#d9d9d9", fontSize: "1rem" }}
            />
          ),
          supplement: "等待买家完成交易",
          button: (
            <div className="flex equal">
              <WrapLink
                onClick={() => this.overBuy(id)}
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                完成交易
              </WrapLink>
            </div>
          )
        };
      case 10:
        return {
          text: "买家已退货",
          icon: <i className="i-back c-second" style={{ fontSize: "1rem" }} />,
          supplement: "等待卖家确认退货",
          button: (
            <div className="flex equal">
              <WrapLink
                onClick={this.remindGood}
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                提醒收货
              </WrapLink>
            </div>
          )
        };
      case 11:
        return {
          tetx: "已核销",
          icon: <i className="i-used" style={{ fontSize: "1rem" }} />,
          supplement: "",
          button: (
            <div className="flex equal">
              <WrapLink
                href="/1-my/6-retreat"
                as={`/my/retreat/${id}`}
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                申请退货
              </WrapLink>
            </div>
          )
        };
      default:
        return {
          text: "交易关闭",
          icon: (
            <i
              className="i-fail"
              style={{ color: "#d9d9d9", fontSize: "1rem" }}
            />
          ),
          supplement: "卖家已确认退货 ",
          button: (
            <div className="flex equal">
              <WrapLink
                onClick={() =>
                  alert("确定要删除此订单吗？", "", [
                    { text: "取消" },
                    { text: "确定", onPress: () => this.deleteOrder(id) }
                  ])
                }
                className="equal bg-second flex ai-center jc-center font30 c-white"
              >
                删除订单
              </WrapLink>
            </div>
          )
        };
    }
  };
  // 去支付
  goPay = () => {
    // ...
  };
  // 删除订单
  deleteOrder = () => {
    // ...
  };
  // 确定收货
  confirmGood = () => {
    // ..
  };

  // 提醒收货
  remindGood = () => {
    // ..
    Toast.info("已提醒卖家收货", 2);
  };
  // 完成交易
  overBuy = () => {
    // ..
  };

  render() {
    const { data } = this.state;
    return (
      <Layout title="商品订单详情">
        <NavBar title="商品订单详情" />
        <div className="equal overflow-y">
          {/* icon */}
          <div
            className="bg-white flex column ai-center jc-center mb20"
            style={{ height: "3.05rem" }}
          >
            <div style={{ paddingBottom: "0.35rem" }}>
              {this.backStatus(data.status, data.delivery_type).icon}
            </div>
            <div className="font34 c333 pb20 bold">
              {this.backStatus(data.status, data.delivery_type).text}
            </div>
            <div className="font24 c333">
              {this.backStatus(data.status, data.delivery_type).supplement}
            </div>
          </div>
          {/* 地址 */}
          <div
            className="bg-white flex plr30 ai-center mb20"
            style={{ height: "1.35rem" }}
          >
            <div className="pr25">
              <i className="i-address c-main font40" />
            </div>
            <div>
              <div className="font30 c333 bold pb15">
                {data.member_nickname && data.member_nickname}
              </div>
              <div className="font24 c999 text-overflow-one">
                {data.member_address && data.member_address}
              </div>
            </div>
          </div>
          {/* 拼单  */}
          {data.status > 1 && (
            <div className="bg-white mb20 plr30">
              <div className="font28 c333 h96 ai-center border-bottom-one flex">
                <i className="i-group font40 c999 pr10" />
                拼单成功
              </div>
              <div className="flex jc-between ai-center h110">
                <div className="flex">
                  {data.avatars &&
                    data.avatars.length > 0 &&
                    data.avatars.map((item, index) => {
                      if (index > 3) {
                        return false;
                      }
                      return (
                        <div key={uuid()} className="h50 w50">
                          {index === 3 ? (
                            <div
                              className="font24 bold w-100 h-100 r100 home-img-overflow flex jc-center ai-center"
                              style={{
                                transform: `translateX(${index * -0.15}rem)`
                              }}
                            >
                              ···
                            </div>
                          ) : (
                            <img
                              src="https://dummyimage.com/600x400"
                              className="w-100 h-100 r100 common-img-bg"
                              style={{
                                transform: `translateX(${index * -0.15}rem)`
                              }}
                              alt=""
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
                <WrapLink
                  style={{ width: "1.5rem", border: " solid 1px #b3b3b3" }}
                  className="h50 r10 flex ai-center jc-center c999 lh100"
                >
                  拼团详情
                </WrapLink>
              </div>
            </div>
          )}
          {/* 商品详情 */}
          <div className="bg-white mb20 plr30">
            <div className="h94 flex jc-between ai-center border-bottom-one">
              <div className="flex ai-center">
                <i className="i-business font34 pr10" />
                {data.user_name && data.user_name}
              </div>
              <div>
                <i className="i-right font20 c999" />
              </div>
            </div>
            <List item={data.details} order />
            <div className="h84 flex ai-center jc-between font24 c333 border-bottom-one">
              <div>运费</div>
              <div>￥{data.delivery_fee && data.delivery_fee}</div>
            </div>
            <div className="h84 flex ai-center font24 c333 border-bottom-one">
              <div style={{ paddingRight: "0.45rem" }}>留言</div>
              <div>{data.con && data.con}</div>
            </div>
            <div className="h84 flex ai-center font24 c333 jc-end">
              <div className="flex ai-end">
                小计：
                <span className="c-main font24 lh100">
                  ￥
                  <span className="font40 bold">
                    {data.pay_price && data.pay_price}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* 订单详情 */}
          <div
            className="plr30 bg-white font24 c666"
            style={{ marginBottom: "1.2rem" }}
          >
            <div className="h84 flex ai-center jc-between c333 border-bottom-one bold">
              订单详情
            </div>
            <div className="h84 flex ai-center jc-between border-bottom-one">
              <div>订单编号</div>
              <div>{data.order_id && data.order_id}</div>
            </div>
            <div className="h84 flex ai-center jc-between">
              <div>创建时间</div>
              <div>{data.created_at && data.created_at}</div>
            </div>
            {data.pay_at && (
              <div className="h84 flex ai-center jc-between">
                <div>支付时间</div>
                <div>{data.pay_at}</div>
              </div>
            )}
            {data.pay_price && (
              <div className="h84 flex ai-center jc-between">
                <div>支付金额</div>
                <div>{data.pay_price}</div>
              </div>
            )}
            {data.source && (
              <div className="h84 flex ai-center jc-between">
                <div>支付方式</div>
                <div>{data.source}</div>
              </div>
            )}
            {data.delivery_created_at && (
              <div className="h84 flex ai-center jc-between">
                <div>发货时间</div>
                <div>{data.delivery_created_at}</div>
              </div>
            )}
            {data.delivery_express_comp_name && (
              <div className="h84 flex ai-center jc-between">
                <div>发货物流</div>
                <div>{data.delivery_express_comp_name}</div>
              </div>
            )}
            {data.delivery_express_code && (
              <div className="h84 flex ai-center jc-between">
                <div>发货单号</div>
                <div>{data.delivery_express_code}</div>
              </div>
            )}
            {data.refund_created_at && (
              <div className="h84 flex ai-center jc-between">
                <div>退货申请时间</div>
                <div>{data.refund_created_at}</div>
              </div>
            )}
            {data.return_cause && (
              <WrapLink
                href="/1-my/15-retreat-cause"
                as="/my/retreatCause"
                className="w-100 h84 flex ai-center jc-between"
              >
                <div>退货原因</div>
                <div>{data.return_time}</div>
              </WrapLink>
            )}
            {data.refund_updated_at && (
              <div className="h84 flex ai-center jc-between">
                <div>
                  {data.status && data.status === 9
                    ? "退货拒绝时间"
                    : "退货同意时间"}
                </div>
                <div>{data.refund_updated_at}</div>
              </div>
            )}
            {data.status && data.status === 9 && (
              <WrapLink
                href="/1-my/15-retreat-cause"
                as="/my/retreatCause"
                className="w-100 h84 flex ai-center jc-between"
              >
                <div>拒绝退货原因</div>
                <div>{data.return_time}</div>
              </WrapLink>
            )}
            {data.refund_refunded_at && (
              <div className="h84 flex ai-center jc-between">
                <div>退货时间</div>
                <div>{data.refund_refunded_at}</div>
              </div>
            )}
            {data.refund_express_comp_name && (
              <div className="h84 flex ai-center jc-between">
                <div>退货物流</div>
                <div>{data.refund_express_comp_name}</div>
              </div>
            )}
            {data.refund_express_code && (
              <div className="h84 flex ai-center jc-between">
                <div>退货单号</div>
                <div>{data.refund_express_code}</div>
              </div>
            )}
            {data.refund_completed_at && (
              <div className="h84 flex ai-center jc-between">
                <div>退货完成时间</div>
                <div>{data.refund_completed_at}</div>
              </div>
            )}
          </div>
        </div>
        <div className="home-odrder-bottom flex">
          <WrapLink
            className="flex jc-center ai-center column c999 bg-white h106"
            style={{ width: "2.3rem" }}
          >
            <div className="pb5">
              <i className="i-phone font40" />
            </div>
            <div className="font28">联系客服</div>
          </WrapLink>
          {this.backStatus(data.status, data.delivery_type).button}
        </div>
      </Layout>
    );
  }
}
