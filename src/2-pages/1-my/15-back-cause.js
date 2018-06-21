import React, { Component } from "react";
import { common, http } from "@utils";
import { Toast } from "antd-mobile";
import { Layout, RequestStatus, NavBar } from "@components";

export default class extends Component {
  state = {
    netBad: false,
    causeType: 1
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const searchObj = common.searchToObj()
    const { history } = this.props;
    http
      .get({
        action: "order",
        operation: "show",
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
  render() {
    const { data, netBad, causeType } = this.state;
    if (netBad) return <RequestStatus type="no-net" />;
    if (!data) return <RequestStatus />;
    return (
      <Layout title={`${causeType === 1 ? "退货" : "拒绝退货"}原因`}>
        <NavBar title={`${causeType === 1 ? "退货" : "拒绝退货"}原因`} />
        <div className="equal overflow-y">
          <div
            className="bg-white font28 plr30"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <div className="lh150" style={{ paddingBottom: "0.5rem" }}>
              {data.reason && data.reason}
            </div>
            <div className="flex jc-between wrap">
              {data.images &&
                data.images.length > 0 &&
                data.images.map(item => (
                  <div
                    className="mb30"
                    style={{ width: "2.2rem", height: "2.2rem" }}
                  >
                    <img
                      src={item}
                      className="h-100 w-100 common-img-bg"
                      alt=""
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
