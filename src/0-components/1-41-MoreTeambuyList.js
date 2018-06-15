import React, { PureComponent } from "react";
import { common } from "@utils";
import { WrapLink, OrderCountDown } from "@components";
import { parse } from "date-fns";

const { countDown } = common;
export default class extends PureComponent {
  constructor(props) {
    super(props)
    const { item } = this.props
    const remainNum = Math.max((+item.goods.offerd_num) - (+item.collage_num), 0)
    const milliseconds = +parse(item.created_at) + (item.goods.available_time * 3600 * 1000)
    let timeOver = false
    const remainDate = countDown(milliseconds)
    if (!remainDate) timeOver = true
    this.state = {
      remainNum,
      timeOver,
      milliseconds
    }
  }
  componentDidMount() {
    const { item } = this.props;
    const milliseconds = +parse(item.created_at) + (item.goods.available_time * 3600 * 1000)
    const remainMilliseconds = milliseconds - new Date();
    const remainDate = countDown(milliseconds);

    if (remainDate) {
      this.tick = setTimeout(() => {
        this.setState(({ timeOver: true }))
      }, remainMilliseconds)
    }
  }
  componentWillUnmount() {
    if (this.tick) clearInterval(this.tick);
  }

  render() {
    const { item } = this.props;
    const { remainNum, timeOver, milliseconds } = this.state;
    return (
      <div
        className="flex jc-between ai-center border-bottom-one"
        style={{ height: "1.4rem" }}
      >
        <div className="flex">
          <div className="h80 w80 overflow-h common-img-bg circle">
            {item.fan && item.fan.avatar ? (
              <img
                className="h-100 w-100"
                src={item.fan && item.fan.avatar}
                alt=""
              />
            ) : (
              <div className="h-100 w-100" />
            )}
          </div>
          <div
            className="pl20 font30 flex ai-center"
            style={{ width: "1.8rem" }}
          >
          <div className="text-overflow-one w-100">{item.fan && item.fan.nickname}</div>
          </div>
        </div>
        <div className="flex">
          <div className="flex column lh100 ">
            <div className="font28 pb15 text-right">
              {remainNum > 0 ? (
                <span>
                  还差<span className="c-main plr5">{remainNum}</span>人拼单完成
                </span>
              ) : (
                "拼单完成"
              )}
            </div>
            <div className="c999 font24 text-right">
              <OrderCountDown milliseconds={milliseconds} />
            </div>
          </div>
          {(!timeOver && remainNum > 0) ? (
            <WrapLink
              path={`/details_${item.id}`}
              className="w120 h60 bg-main c-white font24 flex ai-center jc-center ml30 r10"
            >
              去拼单
            </WrapLink>
          ) : (
            <div className="w120 h60 bg-smoke c-white font24 flex ai-center jc-center ml30 r10">
              拼单结束
            </div>
          )}
        </div>
      </div>
    );
  }
}
