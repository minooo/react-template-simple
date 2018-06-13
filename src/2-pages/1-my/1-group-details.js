import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { parse } from "date-fns";
import { common, http } from "@utils";

import {
  Layout,
  NavBar,
  List,
  Steps,
  TeamState,
  WrapLink,
  HomeMoreTeambuyList
} from "@components";

const { countDown } = common;
export default class extends Component {
  state = {
    surplusTime: ""
  };
  // 获取拼团数据
  componentDidMount() {
    this.onAddress();
  }
  // 结束时消除定时器
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onTime = () => {
    // 格式化传入时间
    const { collageData } = this.state;
    const upDateParse = parse(
      collageData && collageData.goods && collageData.goods.end_time
    );
    console.info(upDateParse);
    this.interval = setInterval(
      () => this.timeUpdate(upDateParse, this.interval),
      1000
    );
  };
  // 拼团数据 和 更多拼团列表
  onAddress = () => {
    console.info(this.props.match);
    const { id } = this.props.match.params;
    http.getC(
      {
        action: "collage",
        operation: "show",
        id
      },
      data => {
        console.info(data.data);
        this.setState(
          () => ({
            collageData: data.data
          }),
          () => {
            this.onTime();
            if (data) {
              this.onAddressList(data && data.data.goods.id);
            }
          }
        );
      }
    );
  };
  onAddressList = id => {
    http.getC(
      {
        action: "collage",
        operation: "list",
        goods_id: id
      },
      data => {
        console.info(data);
        this.setState(() => ({
          listData: data.data
        }));
      }
    );
  };
  onShare = () => {
    Toast.success("这是一个微信分享按钮", 1);
  };
  // 创建定时函数
  timeUpdate = (upDateParse, interval) => {
    this.setState(() => ({
      surplusTime: countDown(upDateParse, interval)
    }));
  };
  render() {
    const { collageData, listData, surplusTime } = this.state;
    return (
      <Layout title="拼团详情">
        <div className="equal overflow-y">
          <NavBar title="拼团详情" />
          <div className=" plr30 ptb10 bg-white">
            {/* 获取拼团商品数据 */}
            {collageData && (
              <List
                item={collageData.goods}
                href="/0-home/1-product-detail"
                as={`/product/${collageData.goods &&
                  collageData.goods &&
                  collageData.goods.id}`}
              />
            )}
          </div>
          <div className="h20" />
          {collageData && (
            <Steps
              step={
                collageData && collageData.status && collageData.status === 2
                  ? 4
                  : 3
              }
            />
          )}
          <div className="h20" />
          {collageData && (
            <TeamState
              id={collageData && collageData.id}
              places={
                collageData &&
                collageData.goods &&
                collageData.goods.offerd_num - collageData.collage_num
              }
              offerd_num={
                collageData && collageData.goods && collageData.goods.offerd_num
              }
              status={collageData && collageData.status && collageData.status}
              surplusTime={surplusTime}
              fans={collageData && collageData.fans && collageData.fans}
            />
          )}
          {/* 拼单状态按钮 */}
          <div className="w-100 text-center plr30 bg-white">
            {collageData && collageData.is_self ? (
              collageData.status === 1 ? (
                <div>
                  <WrapLink
                    className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                    onClick={this.onShare}
                  >
                    邀请好友
                  </WrapLink>
                  <div className="h40" />
                  <WrapLink
                    path={`/order_details_${collageData &&
                      collageData.order_id &&
                      collageData.order_id}`}
                    className=" font24 c666 "
                  >
                    查看订单详情
                  </WrapLink>
                  <div className="h40" />
                </div>
              ) : collageData.status === 2 ? (
                <div>
                  <WrapLink
                    path="/"
                    className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                  >
                    去逛逛
                  </WrapLink>
                  <div className="h40" />
                  <WrapLink
                    className=" font24 c666 "
                    path={`/order_details_${collageData &&
                      collageData.order_id &&
                      collageData.order_id}`}
                  >
                    查看订单详情
                  </WrapLink>
                  <div className="h40" />
                </div>
              ) : (
                <div>
                  <WrapLink
                    className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                    path={`/product_detail_${collageData &&
                      collageData.goods_id}`}
                  >
                    重新发起拼单
                  </WrapLink>
                  <div className="h40" />
                  <WrapLink className=" font24 c666 ">
                    或参加别人的拼单
                  </WrapLink>
                  <div className="h40" />
                </div>
              )
            ) : collageData && collageData.status === 1 ? (
              <div>
                <WrapLink
                  path="/submit_order"
                  className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                >
                  立即参团
                </WrapLink>
              </div>
            ) : collageData && collageData.status === 2 ? (
              <div>
                <WrapLink
                  className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                  path={`/product_detail_${collageData &&
                    collageData.goods_id}`}
                >
                  重新发起拼单
                </WrapLink>
                <div className="h40" />
                <WrapLink className=" font24 c666 ">或参加别人的拼单</WrapLink>
                <div className="h40" />
              </div>
            ) : (
              <div>
                <WrapLink
                  className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                  path={`/product_detail_${collageData &&
                    collageData.goods_id}`}
                >
                  重新发起拼单
                </WrapLink>
                <div className="h40" />
                <WrapLink className=" font24 c666 ">或参加别人的拼单</WrapLink>
                <div className="h40" />
              </div>
            )}
          </div>
          <div className="h20" />
          {/* 更多拼单 */}
          {collageData && collageData.is_self && collageData.status === 3 ? (
            <div className=" plr30 bg-white">
              <div className="flex jc-between ai-center border-bottom-one h84">
                <div className=" font24 c333">
                  <span>有</span>
                  <span className=" c-main">{listData && listData.length}</span>
                  人正在参与此拼单
                </div>
                <WrapLink
                  path="/group_list"
                  className=" c999 font24 flex ai-center"
                >
                  <span className=" mr10">查看更多</span>
                  <i className="i-right" />
                </WrapLink>
              </div>
              {listData &&
                listData.length > 0 &&
                listData.map(item => (
                  <HomeMoreTeambuyList key={item.id} item={item} />
                ))}
              <WrapLink
                className=" h80 font30 c999 flex jc-center ai-center w-100"
                path="/group_list"
              >
                查看更多
              </WrapLink>
            </div>
          ) : collageData && collageData.status === 2 ? (
            <div className=" plr30 bg-white">
              <div className="flex jc-between ai-center border-bottom-one h84">
                <div className=" font24 c333">
                  <span>有</span>
                  <span className=" c-main">{listData && listData.length}</span>
                  人正在参与此拼单
                </div>
                <WrapLink
                  path="/group_list"
                  className=" c999 font24 flex ai-center"
                >
                  <span className=" mr10">查看更多</span>
                  <i className="i-right" />
                </WrapLink>
              </div>
              {listData &&
                listData.length > 0 &&
                listData.map(item => (
                  <HomeMoreTeambuyList key={item.id} item={item} />
                ))}
              <WrapLink
                className=" h80 font30 c999 flex jc-center ai-center w-100"
                path="/group_list"
              >
                查看更多
              </WrapLink>
            </div>
          ) : (
            ""
          )}
        </div>
      </Layout>
    );
  }
}
