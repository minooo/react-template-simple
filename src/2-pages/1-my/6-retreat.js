import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { http, wxapi } from "@utils";
import { Layout, WrapLink } from "@components";

export default class extends Component {
  state = {
    localIds: []
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
    const { reason, order_id, localIds } = this.state;
    if (!reason) {
      Toast.info("请填写退货原因", 1);
    } else if (localIds.length > 0) {
     wxapi.uploadImages(localIds).then(resolve => {
      const images = resolve.serverId.join(",");
      http.postC(
        {
          action: "refund",
          operation: "store",
          order_id,
          reason,
          images
        },
        () => {
          Toast.success("退货原因提交成功", 1, () => {
            if (window && window.history && window.history.length > 1) {
              window.history.go(-1);
            }
          });
        }
      );
     });
    } else {
      http.postC(
        {
          action: "refund",
          operation: "store",
          order_id,
          reason
        },
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
  addPhoto = () => {
    const { localIds } = wxapi.chooseImage({
      count: 8,
      sizeType: "compressed"
    });
    console.info(localIds);
    this.setState(pre => ({ localIds: pre.localIds.concat(localIds) }));
  };
  previewImage = item => {
    const { localIds } = this.state;
    wxapi.previewImage(item, localIds);
  };
  render() {
    const { reason, localIds } = this.state;
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
          <div className="bg-white plr30 ptb30">
            {localIds &&
              localIds.length > 0 &&
              localIds.map(item => (
                <div
                  key={item}
                  onClick={this.previewImage(item)}
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
                  onClick={this.addPhoto}
                >
                  <i
                    className="i-add"
                    style={{ color: "#d9d9d9", fontSize: "0.7rem" }}
                  />
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
