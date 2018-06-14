import React, { Component } from "react";
import { common, http } from "@utils";
import { Toast, TextareaItem } from "antd-mobile";
import {
  Layout,
  NavBar,
  WrapLink,
  List,
  Rate,
  RequestStatus
} from "@components";

export default class extends Component {
  state = {
    value: 0,
    netBad: false
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    this.getDate(id);
  }
  onRateChange = index => {
    this.setState(() => ({
      value: index + 1
    }));
  };
  onChange = v => {
    const con = v.trim();
    const canPost = con.length > 4;
    this.setState(() => ({ con, canPost }));
  };
  onSave = () => {
    const { value, canPost, data, con } = this.state;
    if (value === 0) {
      Toast.info("请评分", 1);
      return;
    }
    if (!canPost) {
      Toast.info("请填写5字已上的评论", 2);
      return;
    }
    http.getC(
      {
        action: "user",
        operation: "add_comment",
        goods_id: data.goods.id,
        score: value,
        con,
        order_id: data.order_id
      },
      data => {
        const { history } = this.props;
        if (parseInt(data.errcode, 10) === 0) {
          Toast.info("评分成功", 2, () => {
            const {
              location: { search }
            } = this.props;
            const searchObj = common.searchToObj(search)
            if (searchObj.type && parseInt(searchObj.type, 10) === 1) {
              history.replace("/order_list")
            } else {
              history.replace(`/order_details_${this.state.data.id}`);
            }
          });
        }
      }
    );
  };
  getDate = orderId => {
    const { history } = this.props;
    http
      .get({ action: "order", operation: "show", id: orderId })
      .then(response => {
        const { errcode } = response;
        if (parseInt(errcode, 10) === 0) {
          this.setState(() => ({
            data: response.data
          }));
        } else {
          Toast.fail("该订单不存在", 1, () => {
            history.replace("/");
          });
        }
      })
      .catch(err => {
        this.setState(() => ({ netBad: true }));
        console.info(err);
      });
  };
  render() {
    const { data, value, netBad } = this.state;
    if (netBad) return <RequestStatus type="no-net" />;
    if (!data) return <RequestStatus />;
    return (
      <Layout title="评价">
        <NavBar title="评价" />
        <div className="equal overflow-y">
          <div className="bg-white mb20 plr30">
            {data.goods && (
              <List
                item={data.goods}
                as={`/product_detail_${data.goods.id}`}
                isOrder={{ price: data.goods.low_price, buy_num: data.buy_num }}
              />
            )}
            <div className="h84 flex ai-center jc-between font24 c333 border-bottom-one">
              <div>运费</div>
              <div>￥{data.delivery_fee && data.delivery_fee}</div>
            </div>
            <div className="h84 flex ai-center font24 c333 border-bottom-one">
              <div style={{ paddingRight: "0.45rem" }}>留言</div>
              <div>{data.con || "什么也没说"}</div>
            </div>
            <div className="h84 flex ai-center font24 c333 jc-end">
              <div className="flex ai-end">
                小计：
                <span className="c-main font24 lh100">
                  ￥
                  <span className="font40 bold">
                    {data.pay_price && data.pay_price}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="plr30 bg-white">
            <div className="flex ai-center jc-center border-bottom-one h110">
              <div style={{ width: "3.16rem" }}>
                <Rate
                  value={value}
                  onChange={this.onRateChange}
                  activeIcon={<i className="i-star font44 c-main" />}
                  defaultIcon={<i className="i-star-o font44 c-main" />}
                />
              </div>
            </div>
            <div className="font28 relative">
              <TextareaItem
                ref={ele => (this.textarea = ele)}
                placeholder="请填写给商品评价,5-100字......"
                rows={5}
                count={100}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div
            className="plr30"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <WrapLink
              onClick={this.onSave}
              className="flex r10 h80 ai-center jc-center bg-main c-white font30 w-100"
            >
              提交申请
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
