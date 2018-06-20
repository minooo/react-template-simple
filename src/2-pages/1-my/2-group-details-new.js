import React, { Component } from "react";
import { parse } from "date-fns";
import { Toast } from "antd-mobile";
import { common, http, wxapi } from "@utils";

import {
  Layout,
  NavBar,
  List,
  Steps,
  WrapLink,
  HomeMoreTeambuyList,
  SyncList,
  StateImg,
  OrderCountDown,
  RequestStatus
} from "@components";

const btnStatus = {
  // 自己参与拼团，且满员
  1: [
    { text: "去逛逛", type: "goStroll" },
    { text: "查看订单详情", type: "checkOrder" }
  ],
  // 自己参与拼团，没满员，且拼团进行中
  2: [
    { text: "邀请好友", type: "share" },
    { text: "查看订单详情", type: "checkOrder" }
  ],
  // 自己未参与拼团，没满员，且拼团进行中
  3: [{ text: "立即参团", type: "joinThis" }],
  // 拼团失败 或者 自己未参与拼团，且满员
  4: [
    { text: "重新发起拼团", type: "goGroupPay" },
    { text: "或参加别人的拼团", type: "joinOthers" }
  ]
};
export default class extends Component {
  state = { isOpen: false, selectPrice: 1 };
  // 获取拼团数据
  componentDidMount() {
    this.onAddress();
  }
  // 结束时消除定时器
  componentWillUnmount() {
    if (this.tick) clearInterval(this.tick);
  }
  // 拼团数据 和 更多拼团列表
  onAddress = () => {
    console.info(this.props.match);
    const { id } = this.props.match.params;
    http.getC({ action: "collage", operation: "show", id }, data => {
      this.setState(
        () => ({ collageData: data.data }),
        () => {
          const { collageData } = this.state;

          // 确定按钮状态
          this.btnStatus(collageData);

          // 初始化 剩余名额，结束日期总毫秒数，距离结束剩余毫秒数，状态
          this.initState(collageData);

          // 分享配置
          this.shareConfig(collageData);
        }
      );
    });
  };
  // 获取拼团列表
  onAddressList = id => {
    http.getC(
      {
        action: "collage",
        operation: "list",
        goods_id: id,
        limit: 3
      },
      data => {
        this.setState(() => ({
          listData: data.data
        }));
      }
    );
  };
  // 提交订单
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
  // 底部按钮逻辑
  onBtn = type => {
    const { collageData } = this.state;
    const { history } = this.props;
    if (type === "goStroll") {
      history.push("/");
    } else if (type === "checkOrder") {
      history.push(`/order_details_${collageData.order_id}`);
    } else if (type === "share") {
      this.setState(pre => ({ isOpen: !pre.isOpen }));
    } else if (type === "joinThis") {
      this.onSwitchAlertBg();
    } else if (type === "goGroupPay") {
      history.push(`/product_detail_${collageData.goods_id}`);
    } else {
      history.push(
        `/group_list?id=${collageData.goods_id}&num=${
          collageData.goods.sold_num
        }`
      );
    }
  };
  onPaySure = () => {
    const { history } = this.props;
    const { tipArrStr, skuId, sku, collageData, selectPrice } = this.state;
    const { goods } = collageData;
    if (!sku || sku.length === 0) {
      Toast.fail("抱歉，商品sku异常，请稍后再试");
    } else if (tipArrStr.length === 0) {
      const goods_id = goods.id;
      const goods_sku_id = skuId || sku[0].id;

      // 首先发起拼团，然后跳转到订单页面
      const paramsObj = {
        title: goods.title,
        thumb: goods.thumb,
        price: selectPrice,
        delivery_type: goods.delivery_type, // 配送属性，1 邮寄 2 核销
        delivery_fee: goods.delivery_fee, // 运费
        goods_id,
        goods_sku_id,
        buy_type: 3, // // 类型:1-发起拼团、2-单独购买、3-参团
        launch_log_id: collageData.id
      };
      const paramsStr = common.serializeParams(paramsObj);
      history.push(`/submit_order?${paramsStr}`);
    } else {
      Toast.info(`请选择 ${tipArrStr[0]}`, 1);
    }
  };

  // 点击规格组合
  onItem = (parentId, curItem) => {
    const { attr, sku } = this.state;
    const val =
      this.state[`focus_${parentId}`] === curItem.id ? undefined : curItem.id;
    const newSku = sku.slice();
    let newAttr = attr ? [...attr] : [];

    if (
      attr &&
      attr.length > 0 &&
      attr.filter(item1 => item1.attr_type === 2 && item1.id !== parentId)
        .length > 0
    ) {
      // 在当前点击类别外的数组进行操作，比如点击绿色按钮后，我们在尺寸的数组中进一步处理数据，找出绿色按钮下，可用的尺寸
      attr
        .filter(item1 => item1.attr_type === 2 && item1.id !== parentId)
        .forEach(item2 => {
          // 对 newAttr 处理后获取最新值
          newAttr = newAttr.map(item3 => {
            // 新旧 attr 在同一类别中
            if (item3.id === item2.id) {
              // 比如，在剩下的尺寸中
              item3.values.forEach(item4 => {
                let flag = false;
                // 核心，基于当前循环体中的类别id, 以及点击选中的类别id, 在所有的可用组合中，是否存在某个组合包含这两个id，或者val 是否为空
                // 如果是，则当前的类别是可用状态。
                newSku.forEach(item5 => {
                  if (
                    val === undefined ||
                    (item5.attr.some(x => x.value.id === val) &&
                      item5.attr.some(x => x.value.id === item4.id))
                  ) {
                    flag = true;
                  }
                });
                // eslint-disable-next-line
                item4.valid = flag ? 1 : 2;
              });
            }
            return item3;
          });
        });
    }

    this.setState(
      () => ({
        [`focus_${parentId}`]: val,
        attr: newAttr
      }),
      () => {
        this.updatePrice();
        this.initTipArrStr();
      }
    );
  };
  // 弹层背景
  onSwitchAlertBg = () => {
    this.setState(pre => ({ show: !pre.show }));
  };
  // 根据筛选条件，更新价格,
  updatePrice = () => {
    const { attr, sku, collageData } = this.state;
    const newSku = sku.slice();
    if (
      attr &&
      attr.length > 0 &&
      attr
        .filter(item => item.attr_type === 2)
        .every(item => this.state[`focus_${item.id}`] !== undefined)
    ) {
      const { id, low_price } = newSku.find(item =>
        item.attr
          .filter(item => item.attr_type === 2)
          .every(item => this.state[`focus_${item.id}`] === item.value.id)
      );
      this.setState(() => ({
        selectPrice: low_price,
        skuId: id
      }));
    } else {
      const selectPrice = collageData.goods.low_price;
      this.setState(() => ({ selectPrice }));
    }
  };
  // 初始化提示购买标签
  initTipArrStr = () => {
    const { attr } = this.state;
    const tipArrStr = [];
    if (attr) {
      attr.filter(item => item.attr_type === 2).reduce((init, item) => {
        if (this.state[`focus_${item.id}`] === undefined) {
          init.push(item.title);
        }
        return init;
      }, tipArrStr);
    }
    this.setState(() => ({ tipArrStr }));
  };
  // 确定底部按钮状态
  btnStatus = collageData => {
    const { status } = this.state;
    const { is_self, goods } = collageData;
    let btns = null;
    if (is_self && status === 2) {
      btns = btnStatus["1"];
    } else if (is_self && status === 1) {
      btns = btnStatus["2"];
    } else if (!is_self && status === 1) {
      btns = btnStatus["3"];
    } else {
      btns = btnStatus["4"];
    }

    // 如果符合加入此团条件，则拉取相关的attr sku 数据
    if (btns[0].type === "joinThis") this.initAttrSku();

    // 拼团失败 或者 自己未参与拼团，且满员
    if (btns[0].type === "goGroupPay") this.onAddressList(goods.id);

    this.setState(() => ({ btns }));
  };
  // 初始化 剩余名额，结束日期总毫秒数，距离结束剩余毫秒数，状态
  initState = collageData => {
    const { goods, created_at, fans } = collageData;
    const remainNum = Math.max(
      +goods.offerd_num - ((fans && fans.length) || 0),
      0
    );
    const milliseconds =
      +parse(created_at) + goods.available_time * 3600 * 1000;
    const remainMilliseconds = milliseconds - new Date();

    // 拼团状态(0-未开始、1-拼团中、2-拼团成功、3-拼团失败)
    let status = 0;
    if (remainNum > 0) {
      if (remainMilliseconds > 0) {
        status = 1;
      } else {
        status = 3;
      }
    } else if (remainNum === 0) {
      status = 2;
    }
    this.setState(() => ({
      remainNum,
      milliseconds,
      remainMilliseconds,
      status
    }));

    if (remainMilliseconds > 0) {
      this.tick = setTimeout(() => {
        this.onAddress();
      }, remainMilliseconds);
    }
  };
  // 初始化 atrr sku
  initAttrSku = async () => {
    const { collageData } = this.state;
    try {
      const skuDataP = http.get({
        action: "goods",
        operation: "sku",
        id: collageData.goods_id
      }); // 有效商品组合
      const attrDataP = http.get({
        action: "goods",
        operation: "attr",
        id: collageData.goods_id
      }); // 所有基础分类
      const [skuData, attrData] = await Promise.all([skuDataP, attrDataP]);

      const tipArrStr = [];
      const attrObj = {};

      const newSku = skuData.data.slice();
      let newAttr = attrData.data ? [...attrData.data] : [];
      attrData.data.filter(item1 => item1.attr_type === 2).forEach(item2 => {
        // 对 newAttr 处理后获取最新值
        newAttr = newAttr.map(item3 => {
          // 新旧 attr 在同一类别中
          if (item3.id === item2.id) {
            // 比如，在剩下的尺寸中
            item3.values.forEach(item4 => {
              let flag = false;
              // 核心，基于当前循环体中的类别id, 以及点击选中的类别id, 在所有的可用组合中，是否存在某个组合包含这两个id，或者val 是否为空
              // 如果是，则当前的类别是可用状态。
              newSku.forEach(item5 => {
                if (item5.attr.some(x => x.value.id === item4.id)) {
                  flag = true;
                }
              });
              // eslint-disable-next-line
              item4.valid = flag ? 1 : 2;
            });
          }
          return item3;
        });
      });

      if (newAttr && newAttr.length > 0) {
        newAttr.filter(item => item.attr_type === 2).reduce((init, item) => {
          // 如果类别只有一个选项，则默认选中
          if (item.values && item.values.length === 1) {
            attrObj[`focus_${item.id}`] = item.values[0].id;
          }
          // 由于类别只有一个选项默认选中，所以只考虑有多个选项的
          if (item.values && item.values.length > 1) {
            init.push(item.title);
          }
          return init;
        }, tipArrStr);
      }
      // 当前拼单信息
      // eslint-disable-next-line
      this.setState(() => ({
        attr: newAttr,
        sku: skuData.data,
        ...attrObj,
        tipArrStr
      }));
    } catch (error) {
      console.info(error);
    }
  };
  // 分享配置
  shareConfig = collageData => {
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
  };
  // 渲染当前的拼单列表
  renderGroup = item => <HomeMoreTeambuyList key={item.id} item={item} />;
  render() {
    const {
      isOpen,
      collageData,
      milliseconds,
      remainMilliseconds,
      remainNum,
      btns,
      show,
      tipArrStr,
      attr,
      selectPrice,
      listData,
      status
    } = this.state;
    if (!collageData) return <RequestStatus />;
    return (
      <Layout
        title={`拼单${status === 2 ? "完成" : status === 1 ? "中" : "未完成"}`}
      >
        <NavBar
          title={`拼单${
            status === 2 ? "完成" : status === 1 ? "中" : "未完成"
          }`}
        />
        <div className="equal overflow-y">
          {/* 商品 */}
          {collageData.goods && (
            <div className="plr30 ptb10 bg-white mb20">
              <List
                item={collageData.goods}
                as={`/product_detail_${collageData.goods.id}`}
              />
            </div>
          )}

          {/* 拼团状态 */}
          <Steps step={status === 2 ? 4 : 3} />
          <div className="h20" />

          <div className="flex bg-white column ai-center pt10 plr30">
            <div className="font28 c333 ptb30">
              {status === 2 ? (
                "此拼团已满员"
              ) : remainMilliseconds <= 0 ? (
                "拼单时间到，未达到拼单人数"
              ) : (
                <span>
                  仅剩
                  <span className="font30 bold c-main plr10">
                    {remainNum}
                  </span>个名额，
                  {milliseconds !== undefined && (
                    <OrderCountDown milliseconds={milliseconds} />
                  )}{" "}
                  后结束
                </span>
              )}
            </div>
            <StateImg
              imgList={collageData.fans}
              teamId={collageData.id}
              offerd_num={collageData.goods.offerd_num}
            />
            <div className="font30 c333" style={{ marginTop: "0.6rem" }}>
              <span className="c-main">{collageData.goods.offerd_num}人团</span>
              ·拼单{status === 2 ? "完成" : status === 1 ? "中" : "未完成"}
            </div>
            <div className="h40" />
            {btns &&
              btns[0] && (
                <WrapLink
                  className="r10 h80 bg-main c-white font30 w-100 flex jc-center ai-center"
                  onClick={() => this.onBtn(btns[0].type)}
                >
                  {btns[0].text}
                </WrapLink>
              )}
            {btns &&
              btns[1] && (
                <WrapLink
                  className="r10 h60 bg-white c999 font26 w-100 flex jc-center ai-center mt20"
                  onClick={() => this.onBtn(btns[1].type)}
                >
                  {btns[1].text}
                </WrapLink>
              )}
            <div className="h30" />
          </div>

          {/* 商品的正在拼单信息 */}
          {listData &&
            listData.length > 0 && (
              <div className="plr30 bg-white mt20">
                {/* 标题 */}
                <div className="border-bottom-one flex jc-between font24 c333 ptb25">
                  <div>
                    有<span className="plr10 c-main">
                      {collageData.goods.sold_num}
                    </span>人参与拼单
                  </div>
                  {listData.length > 2 && (
                    <WrapLink
                      path={`/group_list?id=${collageData.goods_id}&num=${
                        collageData.goods.sold_num
                      }`}
                      className="c999"
                    >
                      查看更多&nbsp;<i className="i-right" />
                    </WrapLink>
                  )}
                </div>
                <SyncList
                  items={listData.slice(0, 2)}
                  renderItem={this.renderGroup}
                />
              </div>
            )}
        </div>
        {/* 分享弹窗 */}
        {isOpen && (
          <div className="home-share" onClick={this.onSwitch}>
            <img
              src="http://public.duduapp.net/new-media/app/static/share.png"
              className="w-100"
              alt=""
            />
          </div>
        )}
        {/* 半透明背景 */}
        <div
          className={show ? "common-alert-bg" : ""}
          onClick={this.onSwitchAlertBg}
        />
        {/* 商品具体规格选择窗口 */}
        <div
          className={`product-pay ${
            show ? "product-pay-show" : "product-pay-hide"
          }`}
        >
          {/* 上 */}
          <div className="h60" />
          <div className="bg-white">
            {/* 头部 */}
            <div className="relative flex ai-end plr30">
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  position: "absolute",
                  left: "0.3rem",
                  bottom: 0
                }}
                className="overflow-h r10 common-img-bg"
              >
                <img
                  src={collageData.goods.thumb}
                  className="w-100 h-100"
                  alt=""
                />
              </div>
              <div style={{ width: "2.3rem", height: "1.4rem" }} />
              <div className="equal relative">
                <div
                  style={{ position: "absolute", right: 0, top: 0 }}
                  onClick={this.onSwitchAlertBg}
                >
                  <i className="i-close font24 c999" />
                </div>
                <div className="font24 c999 ptb15">
                  <span className="font22 c-main">¥</span>
                  <span className="font40 bold c-main mr30">{selectPrice}</span>
                  {collageData.goods.offerd_num}人拼团
                </div>
                {tipArrStr !== undefined && (
                  <div className="font24 c666 ptb10">
                    {tipArrStr.length === 0
                      ? "可以立即购买啦！"
                      : `请选择 ${tipArrStr.map(item => item)}`}
                  </div>
                )}
              </div>
            </div>

            {/* 主干 */}
            <div style={{ maxHeight: "5.2rem" }} className="pl30 overflow-y">
              {attr &&
                attr.length > 0 &&
                attr.filter(m => m.attr_type === 2).length > 0 &&
                attr.filter(m => m.attr_type === 2).map(item => (
                  <div key={item.id} className="font24 c666">
                    <div className="mb25 pt30">{item.title}</div>
                    <div className="flex wrap">
                      {item.values &&
                        item.values.length > 0 &&
                        item.values.map(x => (
                          <button
                            key={x.id}
                            className={`plr25 lh100 ptb15 ${
                              x.valid === 2
                                ? "c999 bg-border"
                                : this.state[`focus_${item.id}`] === x.id
                                  ? "bg-main c-white"
                                  : "c333 bg-border"
                            } mr30 mb15 r100`}
                            onClick={
                              x.valid === 2
                                ? null
                                : () => this.onItem(item.id, x)
                            }
                          >
                            {x.title}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              <div className="flex jc-between ai-center pt20 pr30">
                <div className="font24 c666">购买数量</div>
                <div className="font30 bold-mid">1</div>
              </div>
              <div className="h40" />
            </div>
          </div>

          {/* 按钮 */}
          <button
            className="h98 bg-main w-100 c-white font34"
            onClick={this.onPaySure}
          >
            确定
          </button>
        </div>
      </Layout>
    );
  }
}
