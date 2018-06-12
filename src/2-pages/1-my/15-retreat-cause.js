import React, { Component } from "react";
import { Layout } from "@components";

export default class extends Component {
  state = {
    data: {
      content: "请说出你的理由,请说出你的理由,请说出你的理由,请说出你的理由",
      image: [
        "https://dummyimage.com/600x400",
        "https://dummyimage.com/600x400",
        "https://dummyimage.com/600x400",
        "https://dummyimage.com/600x400"
      ]
    }
  };

  render() {
    const { data } = this.state;
    return (
      <Layout title="退货原因">
        <div className="equal">
          <div
            className="bg-white font28 plr30"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <div className="lh150" style={{ paddingBottom: "0.5rem" }}>
              {data.content && data.content}
            </div>
            <div className="flex jc-between wrap">
              {data.image &&
                data.image.length > 0 &&
                data.image.map(item => (
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
