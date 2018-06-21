import React from "react";
import { Rate } from "@components";

export default ({ item }) => (
  <div className="border-bottom-one ptb30">
    <div className="flex ai-center jc-between pb25">
      <div className="flex ai-center">
        <div className="h60 w60 common-img-bg circle">
          <img
            src={item.member && item.member.avatar}
            className="w-100 h-100 r100"
            alt=""
          />
        </div>
        <div className="pl20 font28">{item.member && item.member.nickname}</div>
      </div>
      <div style={{ width: "1.5rem" }}>
        <Rate
          value={item.score}
          activeIcon={<i className="i-star font20 c-main" />}
          defaultIcon={<i className="i-star-o font20 c-main" />}
        />
      </div>
    </div>
    <div className="font28 text-overflow-2 mb25">{item.con}</div>
    <div className="flex jc-between c999">
      <div className="equal mr20">
        规格：{item.sku &&
          item.sku.length > 0 &&
          item.sku.filter(x => x.attr_type === 2).length > 0 &&
          item.sku
            .filter(x => x.attr_type === 2)
            .map(x => x.value && x.value.title)
            .join("，")}
      </div>
      <div>{item.created_at}</div>
    </div>
  </div>
);
