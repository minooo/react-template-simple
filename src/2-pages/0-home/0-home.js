import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getHomeCollage,
} from "@actions";

import { Layout, List, WrapLink, OrderTip, NavBar, ScrollLoad } from "@components";

@connect(({ home_collage }) => ({
  home_collage
}), {
  getHomeCollage
})

export default class extends Component {
  componentDidMount() {
    const { home_collage, getHomeCollage } = this.props
    if (!home_collage) { getHomeCollage() }
  }
  renderItem = item => <List key={item.id} href="/0-home/1-product-detail" as={`/product/${item.id}`} item={item} />
  render() {
    const { home_collage } = this.props
    return (
      <Layout title="拼团-首页">
        <NavBar leftCon={false} title="拼团" />
        <ScrollLoad
          dataParam={{ action: "goods", operation: "list" }}
          renderItem={this.renderItem}
          listsClass="plr30 bg-white"
        >
          {/* 发起拼团 */}
          <div className="home-tip overflow-h pl30 w-100">
            { home_collage && home_collage.length > 0 && <OrderTip data={home_collage} /> }
          </div>
          {/* 标题 */}
          <div className="h96 flex ai-center pl30 bg-white">
            <i className="i-recommend c-main font36 mr10" />
            <span className="c333 bold">今日推荐</span>
          </div>

          {/* 我的订单 */}
          <WrapLink
            className="flex column jc-center ai-center c-white bg-main circle home-order-btn"
            path="/order_list"
          >
            <i className="font40 i-star font40 mb10" />
            <span className="font24">我的订单</span>
          </WrapLink>
        </ScrollLoad>
      </Layout>
    );
  }
}
