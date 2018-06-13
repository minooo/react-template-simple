import React, { Component } from "react";
import { Layout, NavBar, HomeMoreTeambuyList, ScrollLoad } from "@components";

export default class extends Component {
  // static async getInitialProps({ ctx }) {
  //   const { res } = ctx;
  //   try {
  //     const { data } = await http.get("get_collage_num", null, !!res);
  //     return { num: data };
  //   } catch (error) {
  //     const err = util.inspect(error);
  //     return { err };
  //   }
  // }
  constructor(props) {
    super(props);
    const {
      history: { search }
    } = this.props;
    const goodsNum = search && search.num;
    const goodsId = search && search.id;
    this.state = {
      goodsNum,
      goodsId
    };
  }
  // 渲染当前的拼单列表
  renderGroup = item => <HomeMoreTeambuyList key={item.id} item={item} />;
  render() {
    const { num } = this.props;
    const { goodsNum, goodsId } = this.state;
    return (
      <Layout title="更多拼单">
        <NavBar title="更多拼单" />
        <ScrollLoad
          renderItem={this.renderGroup}
          dataParam={{ action: "collage", operation: "list", goods_id: goodsId }}
          listsClass="plr30 bg-white"
        >
          <div className="h60 bg-smoke plr30 flex ai-center font24 c666">
            {goodsNum != null ? (
              parseInt(goodsNum, 10) === 0 ? (
                "还木有人参与拼单，快来加入吧！"
              ) : (
                <span>
                  有<span className="c-main plr5">{goodsNum}</span>人正在参与拼单
                </span>
              )
            ) : num === 0 ? (
              "还木有人参与拼单，快来加入吧！"
            ) : (
              <span>
                有<span className="c-main plr5">{num}</span>人正在参与拼单
              </span>
            )}
          </div>
        </ScrollLoad>
      </Layout>
    );
  }
}
