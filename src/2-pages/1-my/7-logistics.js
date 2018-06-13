import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { http } from "@utils";
import { Layout, NavBar } from "@components";

export default class extends Component {
  state = {};
  componentDidMount() {
    this.onAddress();
  }
  // 获取退货订单号
  onAddress = () => {
    console.info(this.props.match);
    const { id } = this.props.match.params;
    if (id) {
      this.setState(() => ({ order_id: id }));
    }
  };
  // 获取输入数据
  onChange = (val, type) => {
    if (type === "express_comp_name" || type === "express_code") {
      const { value } = val.target;
      this.setState(() => ({ [type]: value }));
    }
  };
  // 设置
  onSetting = () => {
    const { order_id, express_comp_name, express_code } = this.state;
    if (!express_comp_name) {
      Toast.info("请填写退货快递公司", 1);
    } else if (!express_code) {
      Toast.info("请填写退货快递单号", 1);
    } else {
      http.postC(
        {
          action: "refund",
          operation: "delivery",
          order_id,
          express_comp_name,
          express_code
        },
        () => {
          Toast.success("退货信息提交成功", 1, () => {
            if (window && window.history && window.history.length > 1) {
              window.history.go(-1);
            }
          });
        }
      );
    }
  };
  render() {
    const { express_comp_name, express_code } = this.state;
    return (
      <Layout title="添加退货物流">
        <div className="equal overflow-y">
          <NavBar title="添加退货物流" />
          <div className=" plr30 bg-white">
            <div className=" h88 flex ai-center border-bottom-one">
              <div className="font28 c333">退货物流</div>
              <input
                className="w-100 h40 reset equal my-input-reset pl20"
                type="text"
                placeholder=""
                value={express_comp_name || ""}
                onChange={val => this.onChange(val, "express_comp_name")}
              />
            </div>
            <div className=" h88 flex ai-center border-bottom-one">
              <div className="font28 c333">退货单号</div>
              <input
                className="w-100 h40 reset equal my-input-reset pl20"
                type="text"
                placeholder=""
                value={express_code || ""}
                onChange={val => this.onChange(val, "express_code")}
              />
            </div>
          </div>
          <div className="plr30">
            <div className="h44" />
            <button
              onClick={this.onSetting}
              className=" c-white font30 w-100 h80 bg-main r10"
            >
              提交
            </button>
          </div>
        </div>
      </Layout>
    );
  }
}
