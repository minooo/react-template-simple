import React, { Component } from "react";
import { Toast, TextareaItem } from "antd-mobile";
import { Layout, NavBar, WrapLink, List, Rate } from "@components";

export default class extends Component {
  state = {
    value: 0,
    data: {
      details: {
        thumb: "https://dummyimage.com/600x400",
        title: "title",
        price: 123,
        count: 12
      },
      freight: 24,
      price: 123,
      message: "友军模拟盘"
    }
  };
  onRateChange = index => {
    this.setState(() => ({
      value: index + 1
    }));
  };
  onChange = v => {
    const con = v.trim();
    const canPost = con.length > 4;
    this.setState(() => ({ con, canPost }));
  };
  onSave = () => {
    const { value, canPost } = this.state;
    if (value === 0) {
      Toast.info("请评分", 1);
      return;
    }
    if (!canPost) {
      Toast.info("请填写5字已上的评论", 2);
    }
  };
  render() {
    const { data, value } = this.state;
    return (
      <Layout title="评价">
        <NavBar title="评价" />
        <div className="equal overflow-y">
          <div className="bg-white mb20 plr30">
            <List item={data.details} order />
            <div className="h84 flex ai-center jc-between font24 c333 border-bottom-one">
              <div>运费</div>
              <div>￥{data.freight}</div>
            </div>
            <div className="h84 flex ai-center font24 c333 border-bottom-one">
              <div style={{ paddingRight: "0.45rem" }}>留言</div>
              <div>{data.message}</div>
            </div>
            <div className="h84 flex ai-center font24 c333 jc-end">
              <div className="flex ai-end">
                小计：
                <span className="c-main font24 lh100">
                  ￥<span className="font40 bold">{data.price}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="plr30 bg-white">
            <div className="flex ai-center jc-center border-bottom-one h110">
              <div style={{ width: "3.16rem" }}>
                <Rate
                  value={value}
                  onChange={this.onRateChange}
                  activeIcon={<i className="i-star font44 c-main" />}
                  defaultIcon={<i className="i-star-o font44 c-main" />}
                />
              </div>
            </div>
            <div className="font28 relative">
              <TextareaItem
                ref={ele => (this.textarea = ele)}
                placeholder="请填写给商品评价,5-100字......"
                rows={5}
                count={100}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div
            className="plr30"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <WrapLink
              onClick={this.onSave}
              className="flex r10 h80 ai-center jc-center bg-main c-white font30 w-100"
            >
              提交申请
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
