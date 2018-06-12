import React from "react";
import { connect } from "react-redux";
// import getUser from '../actions/user'
// import { Loading } from '../components'
@connect(
  null,
  {}
)
export default class extends React.Component {
  componentWillMount() {}
  render() {
    return this.props.children;
  }
}
