import React, { PureComponent, Fragment } from "react"
import { common } from "@utils"
import { setInterval } from "timers";

export default class extends PureComponent {
  constructor(props) {
    super(props)
    const { milliseconds } = this.props
    const dateObj = common.countDown(milliseconds)
    let curTime = ""
    if (!dateObj) curTime = "已过期"
    this.state = {
      curTime
    }
  }
  componentDidMount() {
    const { milliseconds } = this.props
    const dateObj = common.countDown(milliseconds)
    if (dateObj) {
      this.click = setInterval(() => {
        const nowDate = common.countDown(milliseconds)
        if (!nowDate) {
          clearInterval(this.click)
        } else {
          const { getdays, getHours, getMinutes, getSeconds } = nowDate
          const str = `${getdays === 0 ? "" : `${getdays}天:`}${getHours}:${getMinutes}:${getSeconds}`
          this.setState(() => ({ curTime: str }))
        }
      }, 1000)
    }
  }
  componentWillUnmount() {
    if (this.click) clearInterval(this.click)
  }
  render() {
    return (
      <Fragment>
        {this.state.curTime}
      </Fragment>
    )
  }
}
