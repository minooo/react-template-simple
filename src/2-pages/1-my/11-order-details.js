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
// 0 待支付 1确认中 2已支付 3订单关闭 4支付失败 5卖家已发货 6买家确认收货-（交易完成）7买家申请退货 8卖家同意退货 9卖家拒绝退货 10卖家拒绝退货，买家同意交易完成-（交易完成）11买家已退货 12卖家确认退货-（交易关闭）13卖家确认无货退款-（交易关闭）14已核销-（交易完成）15已过期 16已退款 18退款中
const statusConfig = {
  0: {
    status: {
      title: "未支付",
      ico: "i-clock font60",
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
      ico: "i-clock font60",
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
    btns: [{ text: "无货退货", class: "equal bg-second", type: "returnGoods" }]
  },
  22: {
    status: {
      title: "买家已付款",
      caption: "等待核销",
      ico: "i-tag font100 c-main",
      bg: "bg-white"
    },
    btns: [
      { text: "申请退款", class: "equal bg-second", type: "returnGoods" },
      { text: "查看核销码", class: "equal bg-main", type: "checkCode" }
    ]
  },
  3: {
    status: {
      title: "支付关闭",
      caption: "支付已经关闭",
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
      { text: "确认收货", class: "equal bg-second", type: "confirmReceipt" }
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
    btns: [
      { text: "申请退货", class: "equal bg-second", type: "returnGoods" },
      { text: "评价", class: "equal bg-main", type: "goComment" }
    ]
  },
  62: {
    status: {
      title: "交易完成",
      caption: "买家已确认收货",
      ico: "i-used font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "申请退货", class: "equal bg-second", type: "returnGoods" }]
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
      title: "交易完成",
      caption: "卖家拒绝退货，买家同意交易完成",
      ico: "i-back font56 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "评价", class: "equal bg-second", type: "goComment" }],
    showGroup: true
  },
  102: {
    status: {
      title: "交易完成",
      caption: "卖家拒绝退货，买家同意交易完成",
      ico: "i-back font56 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "已评价", class: "equal equal bg-d9 c666" }],
    showGroup: true
  },
  11: {
    status: {
      title: "买家已退货",
      caption: "等待卖家确认退货",
      ico: "i-back font56 c-white",
      bg: "bg-second"
    },
    btns: [{ text: "提醒卖家收货", class: "equal bg-second", type: "tipReceipt" }],
    showGroup: true
  },
  12: {
    status: {
      title: "交易关闭",
      caption: "卖家确认退货",
      ico: "i-fail font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-second", type: "delOrder" }],
    showGroup: true
  },
  13: {
    status: {
      title: "交易关闭",
      caption: "无货退款",
      ico: "i-fail font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-second", type: "delOrder" }],
    showGroup: true
  },
  14: {
    status: {
      title: "已核销",
      ico: "i-used font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "评价", class: "equal bg-second", type: "goComment" }],
    showGroup: true
  },
  142: {
    status: {
      title: "已核销",
      ico: "i-used font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "已评价", class: "equal bg-d9 c666" }],
    showGroup: true
  },
  15: {
    status: {
      title: "订单超时",
      caption: "付款",
      ico: "i-fail font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-second", type: "delOrder" }],
    showGroup: true
  },
  16: {
    status: {
      title: "已退款",
      caption: "已完成退款",
      ico: "i-used font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "删除订单", class: "equal bg-d9 c666" }],
    showGroup: true
  },
  18: {
    status: {
      title: "退款中",
      caption: "等待卖家确认退款",
      ico: "i-back font56 c-white",
      bg: "bg-d9"
    },
    btns: [{ text: "等待卖家退款", class: "equal equal bg-d9 c666" }],
  }
};

// 状态值筛选
const selectStatus = item => {
  switch (item.status) {
    case 2:
      return item.delivery_type === 1 ? "2" : "22";
    case 6:
      return item.is_comment ? "62" : "6";
    case 10:
      return item.is_comment ? "102" : "10";
    case 14:
      return item.is_comment ? "142" : "14";
    default:
      return item.status;
  }
};
// 订单信息列表
const orderInfoList = [
  { sign: "order_id", title: "订单编号" },
  { sign: "created_at", title: "创建时间" },
  { sign: "pay_at", title: "支付时间" },
  { sign: "pay_price", title: "支付金额" },
  { sign: "source_val", title: "支付方式" },
  { sign: "delivery_created_at", title: "发货时间" },
  { sign: "delivery_express_comp_name", title: "发货物流" },
  { sign: "delivery_express_code", title: "发货单号" },
  { sign: "refund_created_at", title: "退货申请时间" },
  { sign: "reason", title: "退货原因", type: "reason" },
  { sign: "refund_refused_updated_at", title: "退货拒绝时间" },
  { sign: "refused_reason", title: "退货拒绝原因", type: "rejectReason" },
  { sign: "refund_updated_at", title: "退货同意时间" },
  { sign: "refund_express_comp_name", title: "退货物流" },
  { sign: "refund_express_code", title: "退货单号" },
  { sign: "refund_refunded_at", title: "退货时间" },
  { sign: "refund_completed_at", title: "退货完成时间" }
];

// const util = require("util");

// const initData = {
//   id: 1,
//   status: 0,
//   member_region: "郑州市金水区",
//   member_address: "受到法律卡机了撒旦发啊打发打发上的",
//   launch_log_id: 2, // 拼团id
//   goods: {
//     thumb: "https://dummyimage.com/600x600",
//     title: "的法律受到法律",
//     low_price: 20
//   },
//   order_id: 123412341,
//   verify_code: 123456,
//   created_at: "2018-06-11 09:44:09",
//   pay_at: "2018-11-12 12:12:00",
//   pay_price: 40,
//   reson: 1
// };

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: { ...statusConfig },
      netBad: false
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.getData(id, data => {
      Promise.resolve({ ...data }).then(response => {
        if (response.status === 0) {
          const { config } = this.state;
          let newConfig;
          const milliseconds = +parse(response.created_at) + 30 * 60 * 1000;
          const remainMilliseconds = milliseconds - new Date();
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
            }, remainMilliseconds);
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
        this.setState(() => ({ item: response }), ()=>{
          const { item }=this.state
          this.initState(item)});
      });
    });
  }

  componentWillUnmount() {
    if (this.tick) clearInterval(this.tick);
  }
  // 订单详情的操作
  onOrderDetailList = type => {
    const { item } = this.state;
    const { history } = this.props;
    // 查看退货原因和拒绝退货原因
    if (type === "reason") {
      history.push(`/back_cause_${item.order_id}?type=1`);
    } else {
      history.push(history.push(`/back_cause_${item.order_id}?type=2`));
    }
  };
  // 获取数据
  getData = (id, success) => {
    const { history } = this.props;
    http
      .get({ action: "order", operation: "show", id })
      .then(response => {
        const { errcode } = response;
        if (parseInt(errcode, 10) === 0) {
          success(response.data);
        } else {
          Toast.fail("该订单不存在", 1, () => {
            history.replace("/");
          });
        }
      })
      .catch(err => {
        this.setState(() => ({ netBad: true }));
        console.info(err);
      });
  };
  // 底部按钮
  handle = type => {
    const { item } = this.state;
    const { history } = this.props;
    const isFull = item.buy_type !== 2 && (item.goods.offerd_num - ((item.joins && item.joins.length) || 0) === 1)
    const payState = {
      goods_id: item.goods.id,
      id: item.id,
      order_id: item.order_id,
      pay_price: item.pay_price,
      buy_type: item.buy_type,
      isFull
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
        history.push(`/retreat_${item.order_id}?type=${item.delivery_type}`);
        break;
      case "checkCode": // 查看核销码
        this.lookCheckCode(item)
        break;
      case "confirmReceipt": // 确认收货
        commonAlert("确认收货", () => {
          this.upOrder(item.id, 6, "已确认收货");
        });
        break;
      case "goComment": // 去评价
        history.push(`/write_comment_${item.id}?type=2`);
        break;
      case "backGoods": // 退还商品
        history.push(`/logistics_${item.order_id}`);
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
    const { history } = this.props;
    http.deleteC({ action: "order", operation: "destroy", id }, () => {
      Toast.info("删除成功", 1, () =>
        history.replace("/order_list")
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
        this.getData(id, data => {
          Toast.info(text, 1)
          this.setState(() => ({
            item: data
          }), () => {
            () => {
              const {item}=this.state
              this.initState(item)
            }
          });
        });
      })
  };
  renderOrderDetail = item => (
    <OrderDetailList
      key={item.sign}
      item={item}
      onClick={() => this.onOrderDetailList(item.type)}
    />
  );
  lookCheckCode = item => {
    if(item.launch_log_status && item.launch_log_status !==2){
      alert("", "拼单未满员，待拼单成功后才能查看核销码哦~", [{ text: "确定" }]);
    }else{
      alert("核销码", item.verify_code, [{ text: "确定" }]);
    }
  }
  // 初始化拼团状态
  initState = item => {
    const { goods, joins_num, launch_log_created_at } = item;
    if(launch_log_created_at){
      return
    }
    const remainNum = Math.max(
      +goods.offerd_num - ((joins_num && joins_num.length) || 0),
      0
    );
    const milliseconds =
      +parse(launch_log_created_at) + (goods.available_time * 3600 * 1000);
    const remainMilliseconds = milliseconds - new Date();

    // 拼团状态(0-未开始、1-拼团中、2-拼团成功、3-拼团失败)
    let status = 0;
    if (remainNum > 0) {
      if (remainMilliseconds > 0) {
        status = 1;
      } else {
        status = 3;
      }
    } else if (remainNum === 0) {
      status = 2;
    }
    this.setState(() => ({
      status
    }))
    if (remainMilliseconds > 0) {
      this.tick = setTimeout(() => {
        this.getData(id, data => {
          this.setState(() => ({
            item: data
          }),()=>{
            const {item}=this.state
            this.initState(item)
          } );
        });
      }, remainMilliseconds);
    }
  };
  render() {
    const { item, config, netBad, status } = this.state;
    if (netBad) return <RequestStatus type="no-net" />;
    if (!item) return <RequestStatus />;
    const validOrderInfoList = orderInfoList.filter(x => {
      if (item[x.sign]) {
        x.caption = item[x.sign];
        x.status=item.status
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
            <OrderStatus item={config[selectStatus(item)].status} />
          )}

          {/* 收货地址 */}
          {item && parseInt(item.delivery_type, 10) === 1 && (
            <OrderAddress
              nickname={item.member_nickname}
              mobile={item.member_mobile}
              address={item.member_address}
            />
          )}

          {/* 拼单成功 */}
          {item.buy_type !== 2 && item.launch_log_id && status && (
              <OrderGroup
                status={status}
                list={item.joins}
                groupId={item.launch_log_id}
              />
            )}

          {/* 商品展示 */}
          <div className="plr30 bg-white mb20">
            {item.goods && (
              <List
                as={`/product_detail_${item.goods.id}`}
                item={item.goods}
                isOrder={{ price: item.pay_price }}
              />
            )}
            {item.delivery_type === 1 && item.goods &&
              item.goods.delivery_fee !== undefined && (
                <div className="h84 flex ai-center jc-between font24 c333 border-bottom-one">
                  <div>运费</div>
                  <div>
                    {parseFloat(item.goods.delivery_fee, 10) === 0
                      ? "免运费"
                      : `￥${item.goods.delivery_fee}`}
                  </div>
                </div>
              )}
            <div className="h86 font28 c333 flex ai-center border-bottom-one">
              <span className="pr20">留言</span>
              <div className="pl20 text-overflow-1 equal">
                {item.con || "用户很懒，什么也没说"}
              </div>
            </div>
            <div className="h84 flex jc-end ai-center">
              <div className="font24 c333">
                <span className="bold">小计: </span>
                <span className="font28 c-main">￥</span>
                <span className="font40 bold c-main">
                  {item.pay_price && item.pay_price}
                </span>
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
            href={`tel:${item.user_mobile}`}
            className="w230 flex column jc-center ai-center c999 bg-white"
          >
            <i className="i-phone font34 mb10" />
            <span className="font28">联系客服</span>
          </a>
          {config[item.status] &&
            config[selectStatus(item)].btns.map(x => (
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
