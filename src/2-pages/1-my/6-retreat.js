import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { http } from "@utils";
import { Layout, WrapLink } from "@components";

export default class extends Component {
  state = {
    localIds: [],
    photos: []
  };
  componentDidMount() {
    this.onAddress();
  }
  // 获取退货订单号id
  onAddress = () => {
    console.info(this.props.match);
    const { id } = this.props.match.params;
    if (id) {
      this.setState(() => ({ order_id: id }));
    }
  };
  // 获取输入数据
  onChange = (val, type) => {
    if (type === "reason") {
      const { value } = val.target;
      this.setState(() => ({ [type]: value }));
    }
  };
  // addPhoto = () => {
  //   const { localIds } = wx.chooseImage({
  //     count: 8,
  //     sizeType: "compressed"
  //   });
  // };
  // 设置
  onSetting = () => {
    const { reason, order_id } = this.state;
    if (!reason) {
      Toast.info("请填写退货原因", 1);
    } else {
      http.postC(
        { action: "refund", operation: "store", order_id, reason },
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
    const { reason, localIds, photos } = this.state;
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
          <div>
            {photos &&
              photos.length > 0 &&
              photos.map((item, index) => (
                <div
                  key={item}
                  onClick={this.previewImage(item, index)}
                  style={{ backgroundImage: `url(${item})` }}
                />
              ))}
            {localIds &&
              localIds.length < 8 && (
                <div
                  className=" bg-borde flex jc-center ai-center"
                  style={{
                    width: "1.6rem",
                    height: "1.6rem",
                    border: "dashed 2px #d9d9d9"
                  }}
                >
                  <i className="i-add font60" />
                </div>
              )}
          </div>
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
