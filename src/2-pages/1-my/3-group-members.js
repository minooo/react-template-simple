import React, { Component } from "react";
import { http } from "@utils";
import uuid from "uuid/v4";
import { Layout, NavBar, MyImgList } from "@components";
import chunk from "lodash/chunk";

export default class extends Component {
  // static async getInitialProps(ctx) {
  //   // err req res pathname query asPath
  //   const { store } = ctx;
  //   if (!store.getState().home_banners) {
  //     store.dispatch(getHomeBanners());
  //   }
  // }
  state = { id: 1 };
  componentDidMount() {
    this.onAddress();
  }
  onAddress = () => {
    const { id } = this.state;
    http.getC(
      {
        action: "collage",
        operation: "joins",
        launch_id: id
      },
      data => {
        console.info(data);
        this.setState(() => ({
          data: data.data
        }));
      }
    );
  };
  render() {
    const { data } = this.state;
    return (
      <Layout title="拼单人数">
        <div className="equal overflow-y">
          <NavBar title="拼单人数" />
          <div className=" h66 flex jc-center ai-center c999 font28">
            {data && data.expiry_time && data.expiry_time} 凑足{data && data.offerd_num &&
              data.offerd_num}人
          </div>
          <div style={{ paddingTop: "0.4rem" }} className="bg-white plr30 pb10">
            {data &&
              data.joins.length > 0 &&
              chunk(data.joins, 6).map(item => (
                <MyImgList key={uuid()} items={item} />
              ))}
          </div>
        </div>
      </Layout>
    );
  }
}
