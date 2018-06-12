import React from "react";
import { List } from "@components";

// 0-待支付、1-确认中、2-已支付、3-交易关闭、4-支付失败、5-卖家已发货、6-买家确认收货、7-买家申请退货、8-卖家同意退货、9-卖家拒绝退货、10-买家确认退货、11-已核销 12-无货退款、13-交易已完成
const btnStatus = {
  0: [
    { title: "删除", type: "delOrder" },
    { title: "去支付", theme: "main", type: "goPay" }
  ],
  2: [{ title: "申请退货", type: "returnGoods" }],
  22: [{ title: "查看核销码", theme: "main", type: "checkCode" }],
  5: [{ title: "确认收货", theme: "main", type: "confirmReceipt" }],
  13: [
    { title: "申请退货", type: "returnGoods" },
    { title: "评价", theme: "main", type: "goComment" }
  ],
  8: [{ title: "退还商品", type: "backGoods" }],
  10: [{ title: "提醒收货", type: "tipReceipt" }],
  3: [{ title: "删除", type: "delOrder" }],
  9: [{ title: "完成交易", type: "finishOrder" }],
  12: [{ title: "删除", type: "delOrder" }]
};

export default ({ item, handle }) => (
  <div className="plr30 bg-white mb20">
    <div className="h90 border-bottom-one font24 c999 flex ai-center">
      <i className="i-order font30 mr25" />
      <div className="flex jc-between equal">
        <span>订单号：{item.order_id}</span>
        <span className="c-main bold-mid">{item.status_val}</span>
      </div>
    </div>
    <List
      item={item}
      href="/1-my/11-order-details"
      as={`/my/order/${item.goods_id}`}
      isOrder={{ price: item.pay_price }}
    />
    <div className="h110 flex jc-between ai-center">
      <div className="font24 c333">
        <span className="bold">小计:</span>
        <span className="font20 c-main">￥</span>
        <span className="font40 bold c-main mr25">
          {item.pay_price}
        </span>
      </div>
      <div>
        {btnStatus[item.status] &&
          btnStatus[
            item.status === 2
              ? item.delivery_type === 1
                ? "2"
                : "22"
              : item.status
          ].map(x => (
            <button
              key={x.type}
              className={`w150 h50 r10 font24 ml20 ${
                x.theme ? "c-main border-main" : "c999 border-default"
              }`}
              onClick={() => handle(x.type, item)}
            >
              {x.title}
            </button>
          ))}
      </div>
    </div>
  </div>
);
