import React, { Component } from "react";
// import uuid from "uuid/v4";
import { Layout, NavBar, Comment, ScrollLoad } from "@components";
import { common } from "@utils"

export default class extends Component {
  static async getInitialProps({ ctx }) {
    const { asPath } = ctx
    const goodsId = common.getUrlLastStr(asPath);
    return { goodsId }
  }
  // 渲染评论
  renderComment = item => <Comment key={item.id} item={item} />;
  render() {
    const { goodsId } = this.props;
    return (
      <Layout title="商品评价">
        <NavBar title="商品评价" />
        <ScrollLoad
          dataPath={`goods/${goodsId}/comment`}
          renderItem={this.renderComment}
          listsClass="plr30 bg-white"
        />
      </Layout>
    );
  }
}
