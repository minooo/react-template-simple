import React from "react";
import { connect } from "react-redux";
import { config, wxapi } from "@utils"
@connect(
  null,
  {}
)
export default class extends React.Component {
  componentDidMount() {
    wxapi.setConfig(config("wx").jsConfig);
  }
  render() {
    return this.props.children;
  }
}
