import React, { Component } from "react";
import { common, http, wxapi } from "@utils";
import { Toast } from "antd-mobile";
import { Layout, RequestStatus, NavBar } from "@components";

export default class extends Component {
  state = {
    netBad: false,
    causeType: 1
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const searchObj = common.searchToObj();
    const { history } = this.props;
    http
      .get({
        action: "refund",
        operation: "reason",
        order_id: id,
        type: (searchObj && searchObj.type) || 1
      })
      .then(response => {
        const { errcode } = response;
        if (parseInt(errcode, 10) === 0) {
          this.setState(() => ({
            data: response.data,
            causeType: parseInt(searchObj.type, 10)
          }));
        } else {
          Toast.fail("订单无效", 1, () => {
            history.replace("/");
          });
        }
      })
      .catch(err => {
        this.setState(() => ({ netBad: true }));
        console.info(err);
      });
  }
  onImages = item => {
    const { data } = this.state;
    wxapi.previewImage(item, data.images);
  };
  render() {
    const { data, netBad, causeType } = this.state;
    if (netBad) return <RequestStatus type="no-net" />;
    if (!data) return <RequestStatus />;
    return (
      <Layout
        title={`${causeType === 1 ? "退款（退货）" : "拒绝退款（退货）"}原因`}
      >
        <NavBar
          title={`${causeType === 1 ? "退款（退货）" : "拒绝退款（退货）"}原因`}
        />
        <div className="equal overflow-y">
          <div
            className="bg-white font28 plr30"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <div className="lh150" style={{ paddingBottom: "0.5rem" }}>
              {data.reason && data.reason}
            </div>
            <div className="flex wrap">
              {data.images &&
                data.images.length > 0 &&
                data.images.map(item => (
                  <div
                    key={item}
                    style={{ width: "33%" }}
                    className="flex jc-center mb30"
                    onClick={() => this.onImages(item)}
                  >
                    <div style={{ width: "1.8rem", height: "1.8rem" }}>
                      <img
                        src={item}
                        className="h-100 w-100 common-img-bg"
                        alt=""
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
