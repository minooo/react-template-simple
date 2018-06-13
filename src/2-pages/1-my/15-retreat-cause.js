import React, { Component } from "react";
import { common, http } from "@utils";
// import Router from "next/router";
import { Toast } from "antd-mobile";
import { Layout, RequestStatus } from "@components";

export default class extends Component {
  state = {
    netBad: false,
  };
  componentDidMount() {
    const orderId = common.getUrlLastStr(window.location.pathname);
    const { query } = Router;
    http
    .get({
      action: "order",
      operation: "show",
      order_id: orderId,
      type: (query && query.type) || 1
    })
    .then(response => {
      const { errcode } = response;
      if (parseInt(errcode, 10) === 0) {
        this.setState(() => ({
          data: response.data
        }));
      } else {
        Toast.fail("该商品还未退货原因", 1, () => {
          Router.replace("/1-my/10-list", "/my/order");
        });
      }
    })
    .catch(err => {
      this.setState(() => ({ netBad: true }));
      console.info(err);
    });
  }
  render() {
    const { data, netBad } = this.state;
    if (netBad) return <RequestStatus type="no-net" />;
    if (!data) return <RequestStatus />;
    return (
      <Layout title="退货原因">
        <div className="equal">
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
