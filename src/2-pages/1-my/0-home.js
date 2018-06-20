import React, { Component } from "react";
import {
  Layout,
  NavBar,
  HomeFilter,
  ScrollLoad,
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
    ]
  };
  onFilterClick = item => {
    this.setState(() => ({ focusId: item.id }));
  };
  renderItem = item => <HomeMyTeamList key={item.id} item={item} />
  render() {
    const { tabs, focusId } = this.state;
    return (
      <Layout title="我的拼团">
        <NavBar title="我的拼团" />
          <HomeFilter
            focusId={focusId}
            filters={tabs}
            onFilterClick={this.onFilterClick}
          />
          <ScrollLoad
            dataParam={{ action: "collage", operation: "my_collages", status: focusId }}
            renderItem={this.renderItem}
          />
      </Layout>
    );
  }
}
