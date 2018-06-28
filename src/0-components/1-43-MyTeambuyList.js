import React from "react";
import { List } from "@components";

// 0 待支付 1确认中 2已支付 3订单关闭 4支付失败 5卖家已发货 6买家确认收货-（交易完成）7买家申请退货 8卖家同意退货 9卖家拒绝退货 10卖家拒绝退货，买家同意交易完成-（交易完成）11买家已退货 12卖家确认退货-（交易关闭）13卖家确认无货退款-（交易关闭）14已核销-（交易完成）15已过期 16已退款 18退款中
const btnStatus = {
  0: [
    { title: "删除", type: "delOrder" },
    { title: "去支付", theme: "main", type: "goPay" }
  ],
  20: [
    { title: "删除", type: "delOrder" },
  ],
  2: [{ title: "无货退款", type: "returnGoods" }],
  22: [
    { title: "申请退款", type: "returnGoods" },
    { title: "查看核销码", theme: "main", type: "checkCode" }
  ],
  3: [{ title: "删除", type: "delOrder" }],
  5: [{ title: "确认收货", theme: "main", type: "confirmReceipt" }],
  6: [
    { title: "申请退货", type: "returnGoods" },
    { title: "评价", theme: "main", type: "goComment" }
  ],
  62: [{ title: "申请退货", type: "returnGoods" }],
  8: [{ title: "退还商品", type: "backGoods" }],
  9: [{ title: "完成交易", type: "finishOrder" }],
  92: [{ title: "查看核销码", theme: "main", type: "checkCode" }],
  10: [{ title: "评价", theme: "main", type: "goComment" }],
  11: [{ title: "提醒卖家收货", type: "tipReceipt" }],
  12: [{ title: "删除", type: "delOrder" }],
  13: [{ title: "删除", type: "delOrder" }],
  14: [{ title: "评价", theme: "main", type: "goComment" }],
  15: [{ title: "删除", type: "delOrder" }],
  16: [{ title: "删除", type: "delOrder" }],
};

// 状态值筛选
const selectStatus = item => {
  switch (item.status) {
    case 2:
    return (item.delivery_type === 1 ? "2" : "22")
    case 6:
    return item.is_comment ? "62" : "6"
    case 9:
    return item.delivery_type === 1 ? "9" : "92";
    case 10:
    return item.is_comment ? "102" : "10"
    case 14:
    return item.is_comment ? "141" : "14"
    default:
    return item.status
  }
};

export default ({ item, handle }) => (
  <div className="plr30 mb20 bg-white">
    <div className="h90 border-bottom-one font24 c999 flex ai-center">
      <i className="i-order font30 mr25" />
      <div className="flex jc-between equal overflow-h">
        <div className="text-overflow-one equal">订单号：{item.order_id}</div>
        <div className="c-main bold-mid text-right text-overflow-one" style={{ width: "2rem" }}>{item.status_val}</div>
      </div>
    </div>
    <div className="pt20 lh100 font24">{item.created_at}</div>
    <List
      item={item}
      as={`/order_details_${item.id}`}
      isOrder={{ price: item.pay_price }}
    />
    <div className="h110 flex jc-between ai-center">
      <div className="font24 c333">
        <span className="bold">小计:</span>
        <span className="font28 c-main">￥</span>
        <span className="font40 bold c-main mr25">{item.pay_price}</span>
      </div>
      <div>
        {btnStatus[item.status] &&
          btnStatus[
           selectStatus(item)
          ] && btnStatus[
            selectStatus(item)
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
