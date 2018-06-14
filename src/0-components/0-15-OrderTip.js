import React, { PureComponent } from "react"
import { WrapLink } from "@components"

const Tip = ({ item, switchClass }) => (
  <WrapLink
    className={`home-tip-item h56 bold-mid font24 c-white flex-inline ai-center ${switchClass}`}
    path={`/details_${item.id}`}
  >
    <img src={item.fan && item.fan.avatar} className="w56 h56 circle equal-no" alt="" />
    <span className="plr10 equal">{item.fan && item.fan.nickname && item.fan.nickname.slice(0, 10)}</span>
    <span className="pr10">发起了拼团</span>
    <i className="i-right pr15" />
  </WrapLink>
)

export default class extends PureComponent {
  state = {
    first: 0,
  }
  componentDidMount() {
    const { data } = this.props
    if (data && data.length > 1) {
      this.tick = setInterval(() => {
        const { first } = this.state;
        const max = data.length - 1;
        const currentFirst = first === max ? 0 : first + 1;
        this.setState(() => ({ first: currentFirst }));
      }, 3000);
    }
  }
  componentWillUnmount() {
    if (this.tick) clearInterval(this.tick)
  }
  render() {
    const { data } = this.props
    const { first } = this.state
    if (!data || data.length === 0) return null
    if (data.length === 1) return <Tip item={data[0]} />
    return (
      <div className="relative h56">
        <Tip item={data[first]} switchClass="common-ordertip-first" />
      </div>
    )
  }
}
