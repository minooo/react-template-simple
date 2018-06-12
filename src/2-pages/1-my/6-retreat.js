import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { http } from "@utils";
import { Layout, WrapLink } from "@components";

export default class extends Component {
  state = { order_id: "20180607164319234784", type: 1 };
  componentDidMount() {
    // this.onAddress();
  }
  // 获取退货订单id和退货类型
  // onAddress = () => {
  //   const {
  //     router: { query }
  //   } = this.props;
  //   if (query && query.id) {
  //     this.setState(() => ({ order_id: query.id }));
  //   }
  // };
  // 获取输入数据
  onChange = (val, type) => {
    if (type === "reason") {
      const { value } = val.target;
      this.setState(() => ({ [type]: value }));
    }
  };
  // 设置
  onSetting = () => {
    const { reason, order_id, type } = this.state;
    if (!reason) {
      Toast.info("请填写退货原因", 1);
    } else {
      http.postC(
        { action: "refund", operation: "store", order_id, type, reason },
        () => {
          Toast.success("退货原因提交成功", 1, () => {
            if (window && window.history && window.history.length > 1) {
              window.history.go(-1);
            }
          });
        }
      );
    }
  };
  render() {
    const { reason } = this.state;
    return (
      <Layout title="申请退货">
        <div className="equal overflow-y">
          <textarea
            className="ptb30 plr30 reset w-100 my-input-reset"
            placeholder="请输入退货理由……"
            rows={5}
            value={reason || ""}
            onChange={val => this.onChange(val, "reason")}
          />
          <div className=" h20" />
          {/* <button onClick={this.onUp} className=" pt30 pl30">
            <img src={image} alt="" className="feedback-button-bg block" />
          </button> */}
          <div className=" h80" />
          <div className="plr30">
            <WrapLink
              className="w-100 h80 bg-main r10 c-white font30"
              onClick={this.onSetting}
            >
              提交申请
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
