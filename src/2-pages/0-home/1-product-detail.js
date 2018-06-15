// /* eslint-disable */
import React, { Component, Fragment } from "react";
import { Toast } from "antd-mobile";
import {
  Layout,
  NavBar,
  WrapLink,
  Steps,
  HomeMoreTeambuyList,
  RequestStatus,
  SyncList,
  Comment
} from "@components";
import { common, http, wxapi, config } from "@utils";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: 0,
      show: false,
      showOth: false,
      inputNum: 1,
      selectPrice: 1,
      stock: 1
    };
    this.onSinglePay = this.onPay.bind(this, "single");
    this.onGroupPay = this.onPay.bind(this, "group");
    this.onAlertBg = this.onPay.bind(this, "no");
    this.onPaySure = this.onPaySure.bind(this);
    this.onImages = this.onImages.bind(this);
    this.input = React.createRef();
  }
  async componentDidMount() {
    const { match: { params } } = this.props
    const { id } = params
    try {
      const goodsDataP = http.get({ action: "goods", operation: "show", id }); // 产品数据
      const skuDataP = http.get({ action: "goods", operation: "sku", id }); // 有效商品组合
      const attrDataP = http.get({ action: "goods", operation: "attr", id }); // 所有基础分类
      const currentGroupDataP = http.get({ action: "collage", operation: "list", goods_id: id, limit: 2 }); // 该商品的拼团列表
      const currentCommentDataP = http.get({ action: "goods", operation: "comment", id }); // 该商品的评论列表
      const [
        goodsData,
        skuData,
        attrData,
        currentGroupData,
        currentCommentData
      ] = await Promise.all([
        goodsDataP,
        skuDataP,
        attrDataP,
        currentGroupDataP,
        currentCommentDataP
      ]);
      if (!goodsData || !skuData || !skuData.data || !attrData || !attrData.data) {
        console.info("必要数据获取失败！")
        return
      }
      const tipArrStr = [];
      const attrObj = {};

      const newSku = skuData.data.slice();
      let newAttr = attrData.data ? [...attrData.data] : [];
      attrData.data
        .filter(item1 => item1.attr_type === 2)
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
                    item5.attr.some(x => x.value.id === item4.id)
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

      if (newAttr && newAttr.length > 0) {
        newAttr
          .filter(item => item.attr_type === 2)
          .reduce((init, item) => {
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
      const desc = common.filterHtml(goodsData.data.con)
      wxapi.setShare({ title: `火热拼团中-${goodsData.data.title}`, desc, imgUrl: goodsData.data.thumb })
      // 当前拼单信息
      // eslint-disable-next-line
      this.setState(() => ({
        goods: goodsData.data,
        attr: newAttr,
        sku: skuData.data,
        currentGroup: currentGroupData.data,
        currentComment: currentCommentData.data,
        ...attrObj,
        tipArrStr,
      }))
    } catch (error) { console.info(error) }
  }
  onPay(type) {
    this.setState(
      pre => ({ show: !pre.show, payType: type }),
      this.updatePrice
    );
  }
  onImages() {
    const { goods } = this.state
    if (goods.images && goods.images.length > 0) {
      wxapi.previewImage(goods.images[0], goods.images)
    }
  }
  onPaySure() {
    const { history } = this.props
    const { tipArrStr, skuId, sku, goods, payType } = this.state;
    if (!sku || sku.length === 0) {
      Toast.fail("抱歉，商品sku异常，请稍后再试");
    } else if (tipArrStr.length === 0) {
      const goods_id = goods.id
      const goods_sku_id = skuId || sku[0].id
      const buy_type = payType === "single" ? 2 : 1
      const price = payType === "single" ? goods.real_price : goods.low_price

      // 首先发起拼团，然后跳转到订单页面
      const paramsObj = {
        title: goods.title,
        thumb: goods.thumb,
        price,
        delivery_type: goods.delivery_type, // 1 邮寄 2 核销
        delivery_fee: goods.delivery_fee, // 配送属性
        goods_id,
        goods_sku_id,
        buy_type // 单独买还是团购
      }
      const paramsStr = common.serializeParams(paramsObj)
      history.push(`/submit_order?${paramsStr}`)
    } else {
      Toast.info(`请选择 ${tipArrStr[0]}`);
    }
  }
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
  onBuyNum = type => {
    // const { stock } = this.state;
    const val = this.input.current.value;
    const inputNum =
      type === "reduce" ? Math.max(+val - 1, 1) : Math.min(+val + 1, 1);
    this.setState(() => ({ inputNum }));
  };
  onInputChange = () => {
    const val = this.input.current.value;
    const reg = /^([1-9][0-9]*)?$/;
    if (reg.test(val)) {
      this.setState(() => ({ inputNum: val }));
    }
  };
  onBlur = () => {
    const { stock } = this.state;
    const val = this.input.current.value;
    const inputNum = val > stock ? stock : val <= 1 ? 1 : val;
    this.setState(() => ({ inputNum }));
  };

  // 切换商品参数展示层
  onProductParam = () => {
    this.setState(pre => ({ showOth: !pre.showOth }));
  };

  // 根据筛选条件，更新价格,
  updatePrice = () => {
    const { payType, attr, sku, goods } = this.state;
    const newSku = sku.slice();
    if (
      attr &&
      attr.length > 0 &&
      attr
        .filter(item => item.attr_type === 2)
        .every(item => this.state[`focus_${item.id}`] !== undefined)
    ) {
      const { id, real_price, low_price, stock } = newSku.find(item =>
        item.attr
          .filter(item => item.attr_type === 2)
          .every(item => this.state[`focus_${item.id}`] === item.value.id)
      );
      const newSelectPrice = payType === "single" ? real_price : low_price;
      const inputNum =
        stock <= this.state.inputNum ? stock : this.state.inputNum;
      this.setState(() => ({
        selectPrice: newSelectPrice,
        stock: 1,
        inputNum,
        skuId: id
      }));
    } else {
      const selectPrice =
        payType === "single" ? goods.real_price : goods.low_price;
      this.setState(() => ({ selectPrice, stock: 1 }));
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

  renderTag = (item, index) => (
    <div key={index} className="font24 c333 mr30 mb20">
      <i className="i-tag mr10 c-main" />
      {item}
    </div>
  );

  // 渲染商品参数
  renderParam = item => (
    <div
      key={item.id}
      className="border-top font28 c999 flex jc-between ai-center ptb25"
    >
      {item.title}
      <div className="c333 equal ml20 text-right">
        {item.values &&
          item.values.length > 0 &&
          item.values.map(x => x.title).join("，")}
      </div>
    </div>
  );

  // 渲染当前的拼单列表
  renderGroup = item => {
    const { goods } = this.state;
    return (
      <HomeMoreTeambuyList
        key={item.id}
        item={item}
        maxNum={goods.offerd_num}
      />
    );
  };
  // 渲染评论
  renderComment = item => <Comment key={item.id} item={item} />;
  render() {
    const {
      show,
      showOth,
      inputNum,
      attr,
      selectPrice,
      tipArrStr,
      stock,
      goods, currentGroup, currentComment
    } = this.state;
    if (!goods) return <RequestStatus />;

    // 查看更多拼团要传的参数
    const paramsObjGroup = {
      id: goods.id,
      num: goods.collage_num
    }
    const paramsStrGroup = common.serializeParams(paramsObjGroup)
    return (
      <Layout title={goods.title}>
        {/* 头部 */}
        <NavBar title={goods.title} rightShare />

        {/* 中间 */}
        <div className="equal overflow-y">
          {/* 图片展示 */}
          <div
            className="relative"
            style={{ height: "80vw", maxHeight: "8rem" }}
          >
            {/* <div className="home-detail-tip overflow-h pl30 w-100">
              {home_collage &&
                home_collage.length > 0 && <OrderTip data={home_collage} />}
            </div> */}
            <div onClick={this.onImages} className="common-img-bg h-100">
              {goods.images &&
                goods.images.length > 0 && (
                  <Fragment>
                    <img className="w-100 h-100" src={goods.images[0]} alt="" />
                    <div className="r10 c333 lh100 ptb10 plr20 home-detail-img-num">
                      1/{goods.images.length}
                    </div>
                  </Fragment>
                )}
            </div>
          </div>

          {/* 标题，价格，拼单量 */}
          <div className="bg-white plr30 ptb25 mb20">
            <div className="font34 c333 lh150 bold">{goods.title}</div>
            <div className="flex jc-between mt30">
              <div className="font28 c-main">
                ¥ <span className="font50 bold mr20">{goods.low_price}</span>
                <del className="font24 c999">{goods.price}</del>
              </div>
              <div className="font24 c999">
                <span className="font40 bold" />
                已拼<span className="plr10 c-main">{goods.sold_num}</span>
                件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{goods.offerd_num}人拼
              </div>
            </div>
          </div>

          {/* 商品标签 */}
          {goods.tags &&
            goods.tags.length > 0 && (
              <div className="pl30 pt25 mb20 flex wrap bg-white">
                <SyncList items={goods.tags} renderItem={this.renderTag} />
              </div>
            )}

          {/* 拼团进度条 */}
          <Steps step={1} />
          <div className="h20" />

          {/* 商品的正在拼单信息 */}
          <div className="plr30 bg-white mb20">
            {/* 标题 */}
            <div className="border-bottom-one flex jc-between font24 c333 ptb25">
              <div>
                有<span className="plr10 c-main">{goods.collage_num}</span>人正在拼单
              </div>
              {currentGroup &&
                currentGroup.length > 1 && (
                  <WrapLink
                    path={`/group_list?${paramsStrGroup}`}
                    className="c999"
                  >
                    查看更多&nbsp;<i className="i-right" />
                  </WrapLink>
                )}
            </div>
            {currentGroup &&
              currentGroup.length > 0 && (
                <SyncList
                  items={currentGroup.slice(0, 2)}
                  renderItem={this.renderGroup}
                />
              )}
          </div>

          {/* 商品参数 */}
          <div
            className="plr30 bg-white mb20 h86 flex jc-between ai-center"
            onClick={this.onProductParam}
          >
            <div className="font28 bold">商品参数</div>
            <i className="i-right font24 c999" />
          </div>

          {/* 商品描述 */}
          <div className="plr30 bg-white mb20">
            {/* 标题 */}
            <div className="font28 bold ptb30 bold border-bottom-one">
              商品描述
            </div>
            <div
              className="c333 font30 lh150 ptb20 common-width100"
              dangerouslySetInnerHTML={{
                __html: goods.con
              }}
              style={{ lineHeight: "200%" }}
            />
          </div>

          {/* 用户评价 */}
          <div className="plr30 bg-white mb20">
            {/* 标题 */}
            <div className="border-bottom-one flex jc-between font24 c333 ptb25">
              <div className="font28 bold">用户评价</div>
              {currentComment &&
                currentComment.length > 1 && (
                  <WrapLink path={`/comment_list_${goods.id}`} className="c999">
                    查看更多&nbsp;<i className="i-right" />
                  </WrapLink>
                )}
            </div>
            {currentComment &&
              currentComment.length > 0 && (
                <SyncList
                  items={currentComment.slice(0, 2)}
                  renderItem={this.renderComment}
                />
              )}
          </div>
          <div className="h20" />
        </div>

        {/* 底部 */}
        <div className="equal-no h108 flex border-top">
          <a
            href={`tel:${config("custom")}`}
            className="equal3 flex column jc-center ai-center c999 bg-white"
          >
            <i className="i-comment font34 mb10" />
            <span className="font28">联系卖家</span>
          </a>
          <WrapLink
            className="equal3 bg-second c-white flex jc-center ai-center column font28"
            onClick={this.onSinglePay}
          >
            <span className="font24">
              <span className="font28">¥ </span>
              <span className="font34 bold">
                {common.tipPrice(goods.real_price).int}
              </span>.{common.tipPrice(goods.real_price).dec}
            </span>
            <span className="lh100 mt5">单独购买</span>
          </WrapLink>
          <WrapLink
            className="equal4 bg-main c-white flex jc-center ai-center column font28"
            onClick={this.onGroupPay}
          >
            <span className="font24">
              <span className="font28">¥ </span>
              <span className="font34 bold">
                {common.tipPrice(goods.low_price).int}
              </span>.{common.tipPrice(goods.low_price).dec}
            </span>
            <span className="lh100 mt5">发起拼单</span>
          </WrapLink>
          {/* 半透明背景 */}
          <div
            className={show || showOth ? "common-alert-bg" : ""}
            onClick={showOth ? this.onProductParam : this.onAlertBg}
          />

          {/* 商品参数展示 */}
          <div
            className={`product-pay bg-white ${
              showOth ? "product-pay-show" : "product-pay-hide"
            }`}
          >
            <div
              style={{ lineHeight: "0.94rem" }}
              className="h94 font34 bold text-center"
            >
              商品参数
            </div>
            <div style={{ maxHeight: "5.2rem" }} className="plr30 overflow-y">
              {goods.attr &&
                goods.attr.length > 0 &&
                goods.attr.filter(x => x.attr_type === 1).length > 0 && (
                  <SyncList
                    items={attr.filter(x => x.attr_type === 1)}
                    renderItem={this.renderParam}
                  />
                )}
            </div>
            {/* 按钮 */}
            <button
              className="h98 bg-main w-100 c-white font34 mt20"
              onClick={this.onProductParam}
            >
              确定
            </button>
          </div>

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
                  <img src={goods.thumb} className="w-100 h-100" alt="" />
                </div>
                <div style={{ width: "2.3rem", height: "1.4rem" }} />
                <div className="equal relative">
                  <div
                    style={{ position: "absolute", right: 0, top: 0 }}
                    onClick={this.onAlertBg}
                  >
                    <i className="i-close font24 c999" />
                  </div>
                  <div className="font24 c999 ptb15">
                    <span className="font22 c-main">¥</span>
                    <span className="font40 bold c-main mr30">
                      {common.clipPrice(selectPrice * inputNum)}
                    </span>
                    {goods.offerd_num}人拼团
                    {/* &nbsp;&nbsp;&nbsp;&nbsp;库存：{stock} */}
                  </div>
                  <div className="font24 c666 ptb10">
                    {tipArrStr.length === 0
                      ? "可以立即购买啦！"
                      : `请选择 ${tipArrStr.map(item => item)}`}
                  </div>
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
                  <div className="flex">
                    <button
                      className="w50 h50 bg-border"
                      onClick={() => this.onBuyNum("reduce")}
                    >
                      <i
                        className={`i-reduce font24 ${
                          inputNum <= 1 ? "c999" : "c333"
                        }`}
                      />
                    </button>
                    <input
                      ref={this.input}
                      maxLength={5}
                      className="w100 text-center bg-border font30 bold-mid product-input"
                      value={inputNum}
                      onChange={this.onInputChange}
                      onBlur={this.onBlur}
                    />
                    <button
                      className="w50 h50 bg-border"
                      onClick={() => this.onBuyNum("add")}
                    >
                      <i
                        className={`i-add font24 ${
                          inputNum < stock ? "c333" : "c999"
                        }`}
                      />
                    </button>
                  </div>
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
        </div>
      </Layout>
    );
  }
}
