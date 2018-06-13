import React, { Component } from "react";
import { Layout, NavBar, Comment, ScrollLoad } from "@components";

export default class extends Component {
  // 渲染评论
  renderComment = item => <Comment key={item.id} item={item} />;
  render() {
    const { id } = this.props.match.params;
    return (
      <Layout title="商品评价">
        <NavBar title="商品评价" />
        <ScrollLoad
          dataParam={{ action: "goods", operation: "comment", id }}
          renderItem={this.renderComment}
          listsClass="plr30 bg-white"
        />
      </Layout>
    );
  }
}
