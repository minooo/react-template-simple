import React from "react";
import { connect } from "react-redux";
import VConsole from "vconsole"
import { config, wxapi } from "@utils"
@connect(
  null,
  {}
)
export default class extends React.Component {
  componentDidMount() {
    wxapi.setConfig({ ...config("wx").jsConfig });
    let a = new VConsole()
  }
  render() {
    return this.props.children;
  }
}
