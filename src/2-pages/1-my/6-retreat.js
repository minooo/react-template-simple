import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { http, wxapi, common } from "@utils";
import { Layout, WrapLink, NavBar } from "@components";

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
  // 设置
  onSetting = () => {
    const { reason, order_id, localIds } = this.state;
    Toast.loading("提交中...");
    if (!reason) {
      Toast.info("请填写退货原因", 1);
    } else if (localIds.length > 0) {
      Toast.hide();
      wxapi.uploadImages({ localIds }).then(resolve => {
        console.info(resolve.serverIds);
        const images = resolve.serverIds.join(",");
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
  // 转换图片为bese64
  getImgData = id => {
    console.info(id);
    wxapi.getLocalImgData(id).then(resolve => {
      console.info(resolve);
      this.setState(pre => ({
        photos: pre.photos.concat(resolve)
      }));
    });
  };
  // 选择图片进行上传
  addPhoto = () => {
    const { localIds } = this.state;
    wxapi
      .chooseImage({
        count: 8 - localIds.length,
        sizeType: "compressed"
      })
      .then(resolve => {
        console.info(resolve);
        this.setState(
          pre => ({
            localIds: pre.localIds.concat(resolve.localIds)
          }),
          () => {
            this.getImgData(resolve.localIds);
          }
        );
      });
  };
  // 上传的图片进行预览
  previewImage = item => {
    const { photos } = this.state;
    wxapi.previewImage(item, photos);
  };
  render() {
    const { reason, localIds, photos } = this.state;
    const searchObj = common.searchToObj();
    return (
      <Layout title={searchObj && parseInt(searchObj.type, 10) === 2 ? "申请退款" : "申请退货"}>
        <div className="equal overflow-y">
          <NavBar title="申请退货" />
          <textarea
            className="ptb30 plr30 reset w-100 my-input-reset"
            placeholder="请输入退货理由……"
            rows={5}
            value={reason || ""}
            onChange={val => this.onChange(val, "reason")}
          />
          <div className=" h20" />
          <div className="bg-white pl30 pt30 pb10 flex wrap">
            {photos &&
              photos.length > 0 &&
              photos.map(item => (
                <div
                  key={item}
                  onClick={() => this.previewImage(item)}
                  style={{ backgroundImage: `url(${item})` }}
                  className="retreat-img"
                />
              ))}
            {localIds &&
              localIds.length < 8 && (
                <div
                  className=" bg-borde flex jc-center ai-center mb20"
                  style={{
                    width: "1.6rem",
                    height: "1.6rem",
                    border: "dashed 2px #d9d9d9"
                  }}
                  onClick={() => this.addPhoto()}
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
              onClick={() => this.onSetting()}
            >
              提交申请
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
