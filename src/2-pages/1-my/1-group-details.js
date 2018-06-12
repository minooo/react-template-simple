import React, { Component } from "react";
// import { http } from "@utils";
import {
  Layout,
  NavBar,
  List,
  Steps,
  TeamState,
  WrapLink,
  HomeMoreTeambuyList
} from "@components";

export default class extends Component {
  state = {
    data: {
      list: {
        id: 1,
        thumb: "https://dummyimage.com/400x400/ff0/f00&text=plugin",
        title: "速度发链接爱上了的咖啡机",
        low_price: 23,
        offerd_num: 234,
        sold_num: 11
      },
      status: 1,
      offerd_num: 2,
      collage_num: 1,
      end_time: "2018-05-26 21:08:22"
    },
    num: 12,
    list: [
      {
        avatar: "https://dummyimage.com/600x400",
        nickname: "马云",
        num: 3,
        id: 1,
        time: "2018-05-26 21:08:22"
      },
      {
        avatar: "https://dummyimage.com/600x400",
        nickname: "马云",
        num: 3,
        id: 12,
        time: "2018-05-29 12:08:22"
      }
    ]
  };


  render() {
    const { data, num, list } = this.state;
    return (
      <Layout title="拼团详情">
        <div className="equal overflow-y">
          <NavBar title="拼团详情" />
          <div className=" plr30 ptb10 bg-white">
            <List
              href="/0-home/1-product-detail"
              as={`/product/${data.list.id}`}
              item={data && data.list}
            />
          </div>
          <div className="h20" />
          <Steps step={data && data.status && data.status === 2 ? 4 : 3} />
          <div className="h20" />
          <TeamState
            status={data && data.status && data.status}
            time={data && data.end_time && data.end_time}
          />
          <div className="h20" />
          <div className=" plr30 bg-white">
            <div className="flex jc-between ai-center border-bottom-one h84">
              <div className=" font24 c333">
                有 <span className=" c-main">{num}</span> 人正在参与此拼单
              </div>
              <WrapLink className=" c999 font24 flex ai-center">
                <span className=" mr10">查看更多</span>
                <i className="i-right" />
              </WrapLink>
            </div>
            {list &&
              list.length > 0 &&
              list.map(item => (
                <HomeMoreTeambuyList key={item.id} item={item} />
              ))}
            <WrapLink
              className=" h80 font30 c999 flex jc-center ai-center w-100"
              href="/0-home/3-group-list"
              as="/grouplist"
            >
              查看更多
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
