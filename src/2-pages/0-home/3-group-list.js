import React, { Component } from "react";
import { Layout, NavBar, HomeMoreTeambuyList, ScrollLoad, RequestStatus } from "@components";
import { common } from "@utils";

export default class extends Component {
  state={}
  componentDidMount() {
    const { history } = this.props
    const { id, num } = common.searchToObj()
    if (!id || !num) history.replace("/")
  }
  // 渲染当前的拼单列表
  renderGroup = item => <HomeMoreTeambuyList key={item.id} item={item} maxNum={item.goods.offerd_num} />;
  render() {
    const { id, num } = common.searchToObj()
    if (!id || !num) return <RequestStatus />
    return (
      <Layout title="更多拼单">
        <NavBar title="更多拼单" />
        <ScrollLoad
          renderItem={this.renderGroup}
          dataParam={{ action: "collage", operation: "list", goods_id: id }}
          listsClass="plr30 bg-white"
        >
          <div className="h60 bg-smoke plr30 flex ai-center font24 c666">
            {parseInt(num, 10) === 0 ? (
                "还木有人参与拼单，快去发起拼单吧！"
              ) : (
                <span>
                  有<span className="c-main plr5">{num}</span>人参与拼单
                </span>
              )}
          </div>
        </ScrollLoad>
      </Layout>
    );
  }
}
