import React, { Component } from "react";
import { Layout, NavBar, HomeMoreTeambuyList, ScrollLoad } from "@components";
import { http, common } from "@utils";

export default class extends Component {
  state={}
  async componentDidMount() {
    common.setTitle("拼团列表")
    try {
      // 获取总的参团人数，某个商品的参团人数，直接从 num 中取。
      const { data } = await http.get({ action: "collage", operation: "get_collage_num" });
      // eslint-disable-next-line
      this.setState(() => ({ totalNum: data }))
    } catch (error) {
      console.info(error)
    }
  }
  // 渲染当前的拼单列表
  renderGroup = item => <HomeMoreTeambuyList key={item.id} item={item} maxNum={item.offerd_num} />;
  render() {
    const { id, num } = common.searchToObj()
    const { totalNum } = this.state;
    return (
      <Layout title="更多拼单">
        <NavBar title="更多拼单" />
        <ScrollLoad
          renderItem={this.renderGroup}
          dataParam={{ action: "collage", operation: "list", ...(id && { goods_id: id }) }}
          listsClass="plr30 bg-white"
        >
          <div className="h60 bg-smoke plr30 flex ai-center font24 c666">
            {num != null ? (
              parseInt(num, 10) === 0 ? (
                "还木有人正在参与拼单，快来发起拼单吧！"
              ) : (
                <span>
                  有<span className="c-main plr5">{num}</span>人正在参与拼单
                </span>
              )
            ) : totalNum === 0 ? (
              "还木有人正在参与拼单，快来发起拼单吧！"
            ) : (
              <span>
                有<span className="c-main plr5">{totalNum}</span>人正在参与拼单
              </span>
            )}
          </div>
        </ScrollLoad>
      </Layout>
    );
  }
}
