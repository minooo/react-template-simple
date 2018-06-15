import React, { Component } from "react";
import { parse } from "date-fns";
import { common, http, wxapi } from "@utils";

import {
  Layout,
  NavBar,
  List,
  Steps,
  TeamState,
  WrapLink,
  HomeMoreTeambuyList,
  RequestStatus
} from "@components";

const { countDown } = common;
export default class extends Component {
  state = {
    surplusTime: "",
    isOpen: false
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
            const { collageData } = this.state;
            const title = `【仅剩${collageData.goods.offerd_num -
              collageData.collage_num}个名额 】我刚花了${
              collageData.goods.low_price
            }元买了${collageData.goods.title}`;
            const desc = `${common.filterHtml(collageData.goods.caption)}`;
            wxapi.setShare({
              title,
              desc,
              imgUrl: collageData.goods.thumb
            });
            this.onTime();
            if (data) {
              this.onAddressList(data.data.goods.id);
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
  // 分享弹窗
  onSwitch = () => {
    this.setState(
      pre => ({ isOpen: !pre.isOpen }),
      () => {
        console.info(this.state.isOpen);
      }
    );
  };
  onTuxedo = () => {
    const { history } = this.props;
    const { collageData } = this.state;
    const paramsObjGroup = {
      title: collageData.goods.title,
      thumb: collageData.goods.thumb,
      goods_id: collageData.goods_id,
      price: collageData.goods.low_price,
      goods_sku_id: collageData.goods_sku_id,
      delivery_type: collageData.goods.delivery_type,
      delivery_fee: collageData.goods.delivery_fee,
      buy_type: 3
    };
    const paramsStrGroup = common.serializeParams(paramsObjGroup);
    history.push(`/submit_order?${paramsStrGroup}`);
  };
  // 创建定时函数
  timeUpdate = (upDateParse, interval) => {
    this.setState(() => ({
      surplusTime: countDown(upDateParse, interval)
    }));
  };
  render() {
    const { isOpen, collageData, listData, surplusTime } = this.state;
    if (!collageData) return <RequestStatus />;
    if (!listData) return <RequestStatus />;
    // 查看更多拼团要传的参数
    const paramsObjGroup = {
      id: collageData.goods.id,
      num: listData.length
    };
    const paramsStrGroup = common.serializeParams(paramsObjGroup);
    return (
      <Layout
        title={
          surplusTime && collageData.status === 1
            ? "拼团中"
            : (surplusTime && collageData.status === 2) ||
              (!surplusTime && collageData.status === 2)
              ? "拼团完成"
              : "拼团失败"
        }
      >
        <div className="equal overflow-y">
          {isOpen && (
            <div className="home-share" onClick={this.onSwitch}>
              <img
                src="http://public.duduapp.net/new-media/app/static/share.png"
                className="w-100"
                alt=""
              />
            </div>
          )}
          <NavBar
            title={
              surplusTime && collageData.status === 1
                ? "拼团中"
                : (surplusTime && collageData.status === 2) ||
                  (!surplusTime && collageData.status === 2)
                  ? "拼团完成"
                  : "拼团失败"
            }
          />
          <div className=" plr30 ptb10 bg-white">
            {/* 获取拼团商品数据 */}
            {collageData && (
              <List
                item={collageData.goods}
                as={`/product_detail_${collageData &&
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
                    onClick={this.onSwitch}
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
                  onClick={this.onTuxedo}
                  className=" r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                >
                  立即参团
                </WrapLink>
                <div className="h40" />
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
                  path={`/group_list?${paramsStrGroup}`}
                  className=" c999 font24 flex ai-center"
                >
                  <span className=" mr10">查看更多</span>
                  <i className="i-right" />
                </WrapLink>
              </div>
              {listData &&
                listData.length > 0 &&
                listData
                  .slice(0, 2)
                  .map(item => (
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
                listData
                  .slice(0, 2)
                  .map(item => (
                    <HomeMoreTeambuyList key={item.id} item={item} />
                  ))}
              <WrapLink
                className=" h80 font30 c999 flex jc-center ai-center w-100"
                path={`/group_list?${paramsStrGroup}`}
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
