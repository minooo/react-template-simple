import React, { Component } from "react";

import {
  Layout,
  NavBar,
  HomeFilter,
  // ScrollLoad,
  HomeMyTeamList
} from "@components";

export default class extends Component {
  state = {
    focusId: undefined,
    tabs: [
      { title: "全部", id: undefined },
      { title: "拼团中", id: 1 },
      { title: "拼团成功", id: 2 },
      { title: "拼团失败", id: 3 }
    ],
    list: [
      {
        id: 11,
        launch_id: 17,
        fan_id: 2,
        from_fan_id: 1,
        created_at: "2018-06-06 19:56:20",
        updated_at: "2018-06-06 19:56:20",
        deleted_at: null,
        goods_id: 17,
        status: 2,
        goods: {
          goods_id: 17,
          title: "meiyou 灭霸",
          images: [""],
          thumb: "",
          end_time: 0,
          collage_num: 0,
          sold_num: 0,
          price: 2
        },
        fans: [
          {
            nickname: "杨云超",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/PiajxSqBRaEJX7Rzib5h68ia0em3Xf5IS4BHxdoed8LmrXficxFWy3cMZgmB6f5To24jQu8E9I7gMNkXpAiabcuYjicA/0"
          },
          {
            nickname: "L",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
          }
        ]
      },
      {
        id: 3,
        launch_id: 2,
        fan_id: 2,
        from_fan_id: 2,
        created_at: "2018-06-04 10:36:15",
        updated_at: "2018-06-04 10:36:16",
        deleted_at: null,
        goods_id: 1,
        status: 3,
        goods: {
          goods_id: 1,
          title: "test",
          images: [
            "https://file.duduapp.net/image/2018/05/03/1c00f30a556a6417ab2b21cd356703e0.png",
            "https://file.duduapp.net/image/2018/05/03/f5ef981fce98dc805d7714cd319982c0.gif"
          ],
          thumb:
            "https://file.duduapp.net/image/2018/05/03/f5ef981fce98dc805d7714cd319982c0.gif",
          end_time: 2,
          collage_num: 0,
          sold_num: 2,
          price: 20
        },
        fans: [
          {
            nickname: "L",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
          },
          {
            nickname: "L",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
          },
          {
            nickname: "L",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
          },
          {
            nickname: "L",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
          }
        ]
      },
      {
        id: 1,
        launch_id: 1,
        fan_id: 2,
        from_fan_id: 1,
        created_at: "2018-06-04 10:34:40",
        updated_at: "2018-06-04 10:34:43",
        deleted_at: null,
        goods_id: 1,
        status: 3,
        goods: {
          goods_id: 1,
          title: "test",
          images: [
            "https://file.duduapp.net/image/2018/05/03/1c00f30a556a6417ab2b21cd356703e0.png",
            "https://file.duduapp.net/image/2018/05/03/f5ef981fce98dc805d7714cd319982c0.gif"
          ],
          thumb:
            "https://file.duduapp.net/image/2018/05/03/f5ef981fce98dc805d7714cd319982c0.gif",
          end_time: 2,
          collage_num: 0,
          sold_num: 2,
          price: 20
        },
        fans: [
          {
            nickname: "L",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/wd4D3PsQHYzRSKjwiaUP8oz3nLNTR4874YUsJAMYt7zvZXWu24UHcwM4vhXTpuCKRXqG4Ew9ENW4vZricOVSkMceoIW2EsdnhN/0"
          },
          {
            nickname: "杨云超",
            headimgurl:
              "http://wx.qlogo.cn/mmopen/PiajxSqBRaEJX7Rzib5h68ia0em3Xf5IS4BHxdoed8LmrXficxFWy3cMZgmB6f5To24jQu8E9I7gMNkXpAiabcuYjicA/0"
          }
        ]
      }
    ]
  };
  onFilterClick = item => {
    this.setState(() => ({ focusId: item.id }));
  };
  render() {
    const { tabs, focusId, list } = this.state;
    return (
      <Layout title="我的拼团">
        <NavBar title="我的拼团" />
        <div className="equal overflow-y">
          <HomeFilter
            focusId={focusId}
            filters={tabs}
            onFilterClick={this.onFilterClick}
          />
          {/* <ScrollLoad
            listsClass="mb20"
            dataPath="/collage/my_collages"
            dataName="data"
            renderRow={item => HomeMyTeamList(item)}
          /> */}
          {list &&
            list.length &&
            list.map(item => <HomeMyTeamList key={item.id} item={item} />)}
        </div>
      </Layout>
    );
  }
}
