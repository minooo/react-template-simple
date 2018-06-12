/* eslint-disable */
import React, { Component } from "react";
import { parse } from "date-fns";
import { Toast, Modal } from "antd-mobile";
import { common, http } from "@utils";
import {
  Layout,
  NavBar,
  List,
  SyncList,
  RequestStatus,
  OrderStatus,
  OrderAddress,
  OrderGroup,
  OrderDetailList,
  OrderCountDown
} from "@components";

const { alert } = Modal;
const commonAlert = (text, handle) =>
  alert(`确定要${text}吗？`, "", [
    { text: "取消" },
    { text: "确定", onPress: handle }
  ]);

const { countDown } = common;

// 4-支付失败 的列表不会出现，所以此情况不再考虑
// 0-待支付、1-确认中、2-已支付、3-交易关闭、4-支付失败、5-卖家已发货、6-买家确认收货、7-买家申请退货、
// 8-卖家同意退货、9-卖家拒绝退货、10-买家确认退货、11-已核销 12-无货退款、13-交易已完成
const statusConfig = {
  0: {
    status: {
      title: "未支付",
      ico: "i-clock font60 c-white",
      bg: "bg-second"
    },
    btns: [
      { text: "删除订单", class: "equal2 bg-second", type: "delOrder" },
      { text: "去支付", class: "equal3 bg-main", type: "goPay" }
    ]
  },
  1: {
    status: {
      title: "支付确认中",
      caption: "等待确认支付完成",
      ico: "i-clock font60 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "等待确认支付完成", class: "equal bg-d9 c666" }]
  },
  2: {
    status: {
      title: "买家已付款",
      caption: "等待卖家发货",
      ico: "i-tag font100 c-main",
      bg: "bg-white"
    },
    btns: [{ text: "提醒发货", class: "equal bg-second", type: "tipReceipt" }],
    showGroup: true
  },
  22: {
    status: {
      title: "买家已付款",
      caption: "等待使用",
      ico: "i-tag font100 c-main",
      bg: "bg-white"
    },
    btns: [{ text: "查看核销码", class: "equal bg-main", type: "checkCode" }],
    showGroup: true
  },
  3: {
    status: {
      title: "交易关闭",
      caption: "卖家已确认退货",
      ico: "i-fail font60 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-second", type: "delOrder" }],
    showGroup: true
  },
  4: {
    status: {
      title: "支付失败",
      ico: "i-fail font60 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-second", type: "delOrder" }]
  },
  5: {
    status: {
      title: "卖家已发货",
      caption: "等待买家确认收货",
      ico: "i-out font56 c-white",
      bg: "bg-main"
    },
    btns: [
      { text: "申请退货", class: "equal bg-second", type: "returnGoods" },
      { text: "确认收货", class: "equal bg-main", type: "confirmReceipt" }
    ],
    showGroup: true
  },
  6: {
    status: {
      title: "交易完成",
      caption: "买家已确认收货",
      ico: "i-used font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-d9 c666", type: "delOrder" }]
  },
  7: {
    status: {
      title: "买家申请退货",
      caption: "等待卖家同意退货",
      ico: "i-used font56 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "等待卖家同意退货", class: "equal bg-d9 c666" }],
    showGroup: true
  },
  8: {
    status: {
      title: "卖家同意退货",
      caption: "等待买家退还商品",
      ico: "i-back font56 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "退还商品", class: "equal bg-second", type: "backGoods" }],
    showGroup: true
  },
  9: {
    status: {
      title: "卖家拒绝退货",
      caption: "等待买家完成交易",
      ico: "i-fail font60 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "完成交易", class: "equal bg-second", type: "finishOrder" }],
    showGroup: true
  },
  10: {
    status: {
      title: "买家已退货",
      caption: "等待卖家确认退货",
      ico: "i-back font56 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "提醒收货", class: "equal bg-second", type: "tipReceipt" }],
    showGroup: true
  },
  11: {
    status: {
      title: "已核销",
      ico: "i-used font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "已核销", class: "equal bg-d9 c666" }],
    showGroup: true
  },
  12: {
    status: {
      title: "交易关闭",
      caption: "无货退款",
      ico: "i-fail font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-second", type: "delOrder" }],
    showGroup: true
  },
  13: {
    status: {
      title: "交易完成",
      caption: "买家已确认收货",
      ico: "i-completed font56 c-white",
      bg: "bg-main"
    },
    btns: [{ text: "评价", class: "equal bg-second", type: "goComment" }],
    showGroup: true
  }
};

// 订单信息列表
const orderInfoList = [
  { sign: "order_id", title: "订单编号" },
  { sign: "verify_code", title: "核销码" },
  { sign: "created_at", title: "创建时间" },
  { sign: "pay_at", title: "支付时间" },
  { sign: "pay_price", title: "支付金额" },
  { sign: "source_val", title: "支付方式" },
  { sign: "delivery_created_at", title: "发货时间" },
  { sign: "delivery_express_comp_name", title: "发货物流" },
  { sign: "delivery_express_code", title: "发货单号" },
  { sign: "refund_created_at", title: "退货申请时间" },
  { sign: "reson", title: "退货原因", type: "reason" },
  { sign: "refund_refused_updated_at", title: "退货拒绝时间" },
  { sign: "refused_reason", title: "退货拒绝原因", type: "rejectReason" },
  { sign: "refund_updated_at", title: "退货同意时间" },
  { sign: "refund_express_comp_name", title: "退货物流" },
  { sign: "refund_express_code", title: "退货单号" },
  { sign: "refund_refunded_at", title: "退货时间" },
  { sign: "refund_completed_at", title: "退货完成时间" }
];

const util = require("util");

const initData = {
  id: 1,
  status: 0,
  member_region: "郑州市金水区",
  member_address: "受到法律卡机了撒旦发啊打发打发上的",
  launch_log_id: 2, // 拼团id
  goods: {
    thumb: "https://dummyimage.com/600x600",
    title: "的法律受到法律",
    low_price: 20
  },
  order_id: 123412341,
  verify_code: 123456,
  created_at: "2018-06-11 09:23:09",
  pay_at: "2018-11-12 12:12:00",
  pay_price: 40,
  reson: 1
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: { ...statusConfig }
    };
  }

  async componentDidMount() {
    const id = common.getUrlLastStr(window.location.pathname);
    Promise.resolve({ ...initData }).then(response => {
      if (response.status === 0) {
        const { config } = this.state;
        let newConfig;
        const milliseconds = +parse(response.created_at) + (30 * 60 * 1000);
        const remainMilliseconds = milliseconds - new Date()
        const remainDate = countDown(milliseconds);
        if (!remainDate) {
          newConfig = {
            ...config,
            0: {
              status: {
                title: "订单超时",
                ico: "i-clock font60 c-white",
                bg: "bg-d9"
              },
              btns: [
                {
                  text: "删除订单",
                  class: "equal2 bg-second",
                  type: "delOrder"
                }
              ]
            }
          };
        } else {
          this.tickTimeout = setTimeout(() => {
            newConfig = {
              ...config,
              0: {
                status: {
                  title: "订单超时",
                  ico: "i-clock font60 c-white",
                  bg: "bg-d9"
                },
                btns: [
                  {
                    text: "删除订单",
                    class: "equal2 bg-second",
                    type: "delOrder"
                  }
                ]
              }
            };
            this.setState(() => ({ config: newConfig }));
          }, remainMilliseconds)
          newConfig = {
            ...config,
            0: {
              status: {
                title: "未支付",
                ico: "i-clock font60 c-white",
                customCaption: (
                  <span className="font24 c-main mt40">
                    <span className="mr30 c333">等待买家付款</span>
                    <OrderCountDown milliseconds={milliseconds} />
                  </span>
                ),
                bg: "bg-second"
              },
              btns: [
                {
                  text: "删除订单",
                  class: "equal2 bg-second",
                  type: "delOrder"
                },
                { text: "去支付", class: "equal3 bg-main", type: "goPay" }
              ]
            }
          };
        }
        this.setState(() => ({ config: newConfig }));
      }
      this.setState(() => ({ item: response }));
    });
    // try {
    //   const { data } = await http.get(`order/${id}`, null, !!res)
    //   if (parseInt(goodsData.errcode, 10) !== 0 && res) {
    //     res.writeHead(301, {
    //       Location: "/"
    //     });
    //     res.end();
    //     res.finished = true;
    //   } else if (parseInt(goodsData.errcode, 10) !== 0 && !res) {
    //     Toast.fail("该商品不存在", 1, () => {
    //       Router.replace("/index", "/");
    //     });
    //   }
    //   return { data }
    // } catch (error) {
    //   const err = util.inspect(error);
    //   return { err };
    // }
  }
  onOrderDetailList = type => {
    console.info(type);
  };
  handle = type => {
    const { item } = this.state;
    switch (type) {
      case "delOrder": // 删除订单
        commonAlert("删除订单", () => {
          console.info("删除订单的逻辑。。。");
        });
        break;
      case "goPay": // 去支付
        // Router.push("/1-my/11-order-details", `/my/order/${item.id}`);
        break;
      case "returnGoods": // 申请退货
        commonAlert("申请退货", () => {
          console.info("申请退货的逻辑。。。");
        });
        break;
      case "checkCode": // 查看核销码
        alert("核销码", item.verify_code, [{ text: "确定" }]);
        break;
      case "confirmReceipt": // 确认收货
        commonAlert("确认收货", () => {
          console.info("确认收货的逻辑。。。");
        });
        break;
      case "goComment": // 去评价
        // Router.push("/1-my/8-write-comment", `/my/writeComment/${item.id}`);
        break;
      case "backGoods": // 退还商品
        commonAlert("退还商品", () => {
          console.info("退还商品的逻辑。。。");
        });
        break;
      case "tipReceipt": // 提醒商家收货
        commonAlert("提醒商家收货", () => {
          console.info("提醒商家收货的逻辑。。。");
        });
        break;
      case "finishOrder": // 完成交易
        commonAlert("完成交易", () => {
          console.info("完成交易的逻辑。。。");
        });
        break;
      default:
        console.info("nothing");
    }
  };
  handle = type => {
    console.info(type)
  }
  renderOrderDetail = item => (
    <OrderDetailList
      key={item.sign}
      item={item}
      onClick={() => this.onOrderDetailList(item.type)}
    />
  );

  render() {
    const { item, config } = this.state;
    if (!item) return <RequestStatus />;
    const validOrderInfoList = orderInfoList.filter(x => {
      if (item[x.sign]) {
        x.caption = item[x.sign];
      }
      return item[x.sign] !== undefined;
    });
    return (
      <Layout title="商品订单详情">
        <NavBar title="商品订单详情" />
        {/* 主体 */}
        <div className="equal overflow-y">
          {/* 订单状态 */}
          {config[item.status] && (
            <OrderStatus item={config[item.status].status} />
          )}

          {/* 收货地址 */}
          {item && (
            <OrderAddress
              title={item.member_region}
              caption={item.member_address}
            />
          )}

          {/* 拼单成功 */}
          {config[item.status] &&
            config[item.status].showGroup && (
              <OrderGroup members={item.members} groupId={item.launch_log_id} />
            )}

          {/* 商品展示 */}
          <div className="plr30 bg-white mb20">
            <List
              href="/0-home/1-product-detail"
              as={`/product/${item.goods_id}`}
              isOrder={{ price: item.goods.low_price, buy_num: item.buy_num }}
              item={item.goods}
            />
            <div className="h86 font28 c333 flex jc-between ai-center border-bottom-one">
              <span>运费</span>
              <span>货到付款</span>
            </div>
            <div className="h86 font28 c333 flex ai-center border-bottom-one">
              <span className="pr20">留言</span>
              <div className="pl20 text-overflow-1 equal">
                {item.con || "什么也没说"}
              </div>
            </div>
            <div className="h84 flex jc-end ai-center">
              <div className="font24 c333">
                <span className="bold">小计:</span>
                <span className="font20 c-main">￥</span>
                <span className="font40 bold c-main">188</span>
              </div>
            </div>
          </div>

          {/* 订单详情 */}
          <div className="plr30 bg-white mb20">
            <div className="h86 flex ai-center border-bottom-one font26 bold">
              订单详情
            </div>
            {validOrderInfoList.length > 0 && (
              <SyncList
                items={validOrderInfoList}
                renderItem={this.renderOrderDetail}
              />
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="h108 equal-no flex">
          <a
            href="tel:13688886666"
            className="w230 flex column jc-center ai-center c999 bg-white"
          >
            <i className="i-comment font34 mb10" />
            <span className="font28">联系客服</span>
          </a>
          {config[item.status] &&
            config[
              item.status === 2
                ? item.delivery_type === 1
                  ? "2"
                  : "22"
                : item.status
            ].btns.map(x => (
              <button
                key={x.type || 1}
                className={`font28 c-white ${x.class}`}
                onClick={() => this.handle(x.type)}
              >
                {x.text}
              </button>
            ))}
        </div>
      </Layout>
    );
  }
}
