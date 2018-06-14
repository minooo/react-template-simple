// 拼单列表
import React from "react";
import { List, WrapLink, HideImg } from "@components";

export default ({ item }) => (
  <div className="bg-white plr30 mb20">
    <div className="h90 border-bottom-one font24 bold-mid c000 flex jc-between ai-center">
      <span>{item.from_fan_id === item.fan_id ? "发起" : "参与"}了拼单</span>
      <span className="c-main font24 pr20">
        {item.status === 1
          ? "拼团中"
          : item.status === 2
            ? "拼团成功"
            : "拼团失败"}
      </span>
    </div>
    <List
      item={item.goods}
      as={`/product/${item.goods_id}`}
    />
    <div className="h110 flex jc-between ai-center">
      <HideImg
        imgList={item.fans}
        imgSize={50}
        margin={-0.1}
        teamId={item.launch_id}
      />
      <div>
        <WrapLink
          path={`/details_${item.id}`}
          className="w150 h50 r10 font24 ml20 c999 border-default flex-inline jc-center ai-center"
        >
          拼单详情
        </WrapLink>
        {item.order_id && (
          <WrapLink
            path={`/order_details_${item.order_id}`}
            className="w150 h50 r10 font24 ml20 c-main border-main flex-inline jc-center ai-center"
          >
            订单详情
          </WrapLink>
        )}
      </div>
    </div>
  </div>
);
