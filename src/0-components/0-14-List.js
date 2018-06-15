import React from "react";
import { WrapLink } from "@components";

export default ({ item, as, isOrder }) => (
  <WrapLink
    className="flex ptb30 border-bottom"
    path={as}
  >
    <div className="w200 h200 equal-no r10 overflow-h bg-smoke mr20">
      <img src={item.thumb} className="w-100 h-100" alt="" />
    </div>
    <div className="equal flex column jc-between">
      <div className="font30 c000 bold-mid lh150 text-overflow-2">
        {item.title}
      </div>
      <div className="flex jc-between font24 c999">
        <div>
          <span className="font28 c-main">￥</span>
          <span className={`${isOrder ? "font30" : "font40"} bold c-main mr25`}>{isOrder ? isOrder.price : item.low_price}</span>
          {!isOrder && `${item.offerd_num}人拼`}
        </div>
        {isOrder ? (
          <div className="font24 c000 bold"><span className="font30 bold" />x1</div>
        ) : (
          <div>
            <span className="font40" />已拼
            <span className="plr10 c-main">{item.sold_num}</span>件
          </div>
        )}
      </div>
    </div>
  </WrapLink>
);

// href={
//   orderItem
//     ? "/1-my/11-order-details"
//     : collageItem
//       ? "/1-my/1-details"
//       : "/0-home/1-product-detail"
// }
// as={
//   orderItem
//     ? `/my/order/${item.id}`
//     : collageItem
//       ? `/1-my/1-details/${item.id}`
//       : `/product/${item.id}`
// }
