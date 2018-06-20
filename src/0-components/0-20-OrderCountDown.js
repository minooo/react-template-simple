import React, { PureComponent, Fragment } from "react"
import { common } from "@utils"

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
    if (dateObj) this.tickDo()
  }
  componentWillUnmount() {
    this.isCancelled = true;
    if (this.tick) clearTimeout(this.tick)
  }
  tickDo = () => {
    const { milliseconds } = this.props
    const nowDate = common.countDown(milliseconds)
    if (!nowDate) {
      clearTimeout(this.tick)
    } else {
      const { getdays, getHours, getMinutes, getSeconds } = nowDate
      const str = getdays > 0 ? `${getdays}天` : `${getHours}:${getMinutes}:${getSeconds}`
      if (!this.isCancelled) this.setState(({ curTime: str }))
      this.tick = setTimeout(this.tickDo, 1000)
    }
  }
  render() {
    return (
      <Fragment>
        {this.state.curTime}
      </Fragment>
    )
  }
}
