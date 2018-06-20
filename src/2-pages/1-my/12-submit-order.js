import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { Layout, NavBar, WrapLink, List } from "@components";
import { http, common } from "@utils";

// const { alert } = Modal;

export default class extends Component {
  state = {
    isFoot: true
  };
  componentDidMount() {
    const { delivery_type } = common.searchToObj();
    if (delivery_type === "1") this.onAddress();
    window.addEventListener("resize", this.footHide)
  }
  // 获取默认地址
  onAddress = () => {
    http.getC(
      {
        action: "address",
        operation: "list",
        is_default: 1
      },
      data => {
        console.info(data);
        this.setState(() => ({
          addressData: data.data[0]
        }));
      }
    );
  };
  // 获取留言信息
  onChange = (val, type) => {
    if (type === "con") {
      const { value } = val.target;
      this.setState(() => ({ [type]: value }));
    }
  };
  // 提交订单
  onSetting = () => {
    // const { history } = this.props;
    const { con, addressData } = this.state;
    const {
      goods_id,
      price,
      goods_sku_id,
      buy_type,
      launch_log_id,
      delivery_type,
      delivery_fee
    } = common.searchToObj();
    if (delivery_type === "1" && (!addressData || !addressData.id)) {
      Toast.info("请选择您的邮寄地址。");
      return;
    }
    Toast.loading("订单处理中...", 60);
    http
      .post({
        action: "order",
        operation: "store",
        goods_id,
        goods_sku_id,
        buy_type, // 类型:1-发起拼团、2-单独购买、3-参团
        ...(buy_type === "3" && { launch_log_id }), // 参团时，必须传关联团的id
        ...(delivery_type === "1" && { address_id: addressData.id }), // 配送属性为邮寄时，需要有配送地址。
        ...(con && { con }) // 留言
      })
      .then(data => {
        const { errcode, msg } = data;
        const { history } = this.props
        if (parseInt(errcode, 10) === 0) {
          Toast.hide();
          const pay_price = common.clipPrice(
            (delivery_type === "1" ? +delivery_fee || 0 : 0) + +price
          );
          const paramsObj = { ...data.data, goods_id, pay_price, buy_type };
          const paramsStr = common.serializeParams(paramsObj);
          history.push(`/pay?${paramsStr}`);
        } else if (parseInt(errcode, 10) === 2) {
          // 订单已存在
          Toast.info(msg, 1, () => {
            history.push(`/order_details_${data.data.id}`);
          });
        } else if (parseInt(errcode, 10) === 1) {
          // 团购已结束
          Toast.info(msg, 1, () => {
            history.push("/");
          });
        } else {
          Toast.info(msg)
        }
      })
      .catch(err => {
        Toast.offline("网络出错，请稍后再试！");
        console.error(err);
      });
  };
  footHide = () => {
    this.setState(pre => ({
      isFoot: !pre.isFoot
    }));
  };
  render() {
    const { addressData, con, isFoot } = this.state;
    const {
      title,
      thumb,
      price,
      delivery_type, // 1 邮寄 2 核销
      delivery_fee,
      goods_id
    } = common.searchToObj();
    return (
      <Layout title="填写订单">
        <NavBar title="填写订单" />
        <div className="equal overflow-y">
          {/* 地址 */}
          {delivery_type === "1" && (
            <WrapLink
              path="/address"
              className="bg-white flex jc-between ai-center mb20 plr30 ptb30 w-100"
            >
              <div className=" flex ai-center">
                <i className="i-address c-main font40 mr25" />
                {addressData ? (
                  <div className=" text-left">
                    <div className="font30 c333 bold pb20 lh100 flex ai-center">
                      <span className=" mr30">
                        {addressData.name && addressData.name}
                      </span>
                      <div
                        style={{
                          borderRadius: "0.16rem",
                          padding: "0.05rem 0.07rem"
                        }}
                        className="bg-main font24 c-white text-center lh100"
                      >
                        默认
                      </div>
                    </div>
                    <div className="font24 c999 text-overflow-2">
                      {addressData.province && addressData.province}
                      {addressData.city && addressData.city}
                      {addressData.county && addressData.county}
                      {addressData.address && addressData.address}
                    </div>
                  </div>
                ) : (
                  <div className=" font30 c333">新增收货地址</div>
                )}
              </div>
              <i className="i-right c999 font20" />
            </WrapLink>
          )}
          {/* 商品详情 */}
          <div className="bg-white mb20 plr30">
            {isFoot && (
              <List
                as={`/product_detail_${goods_id}`}
                item={{ title, thumb }}
                isOrder={{ price }}
              />
            )}

            {delivery_type === "1" &&
              delivery_fee !== undefined && (
                <div className="h84 flex ai-center jc-between font24 c333 border-bottom-one">
                  <div>运费</div>
                  <div>
                    {parseFloat(delivery_fee, 10) === 0
                      ? "免运费"
                      : delivery_fee}
                  </div>
                </div>
              )}
            <div className="h84 flex ai-center font24 c333 border-bottom-one">
              <div style={{ paddingRight: "0.45rem" }}>留言</div>
              <input
                className="w-100 h40 reset equal my-input-reset"
                placeholder="请填写给卖家的留言（选填）"
                value={con || ""}
                onChange={val => this.onChange(val, "con")}
              />
            </div>
            <div className="h84 flex ai-center font24 c333 jc-end">
              <div className="flex ai-end">
                小计：
                <span className="c-main font28 lh100">
                  ￥
                  <span className="font40 bold">
                    {common.clipPrice(
                      (delivery_type === "1" ? +delivery_fee || 0 : 0) + +price
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* 提交订单 */}
          <div
            className="h108 flex border-top w-100 bg-white"
            style={{ position: "fixed", bottom: "0" }}
          >
            <div
              className="flex ai-center equal h-100"
              style={{ paddingLeft: "0.35rem" }}
            >
              <div className="flex ai-end">
                <div className="font24 c-main">
                  <span className="font28 c333">合计：</span>
                  ￥
                  <span className="font40 pl5">
                    {common.clipPrice(
                      (delivery_type === "1" ? ((+delivery_fee) || 0) : 0) + (+price)
                    )}
                  </span>
                </div>
              </div>
            </div>
            <WrapLink
              onClick={this.onSetting}
              style={{ width: "2.6rem" }}
              className="font30 bg-main c-white text-center h-100 flex ai-center jc-center"
            >
              提交订单
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
