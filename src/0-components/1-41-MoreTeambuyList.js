import React, { PureComponent } from "react";
import { common } from "@utils";
import { WrapLink } from "@components";
import { parse } from "date-fns";

const { countDown } = common;
export default class extends PureComponent {
  constructor(props) {
    super(props);
    const { item, maxNum } = this.props;
    const surplusNum = Math.max(
      (maxNum || 0) - ((item && item.collage_num) || 0),
      0
    );
    this.state = {
      surplusTime: "",
      surplusNum
    };
  }
  componentDidMount() {
    const {
      item: { goods }
    } = this.props;
    const upDateParse = parse(goods && goods.end_time);
    this.interval = setInterval(
      () => this.timeUpdate(upDateParse, this.interval),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  timeUpdate = (upDateParse, interval) => {
    this.setState(() => ({
      surplusTime: countDown(upDateParse, interval)
    }));
  };
  render() {
    const { item } = this.props;
    const { surplusTime, surplusNum } = this.state;
    return (
      <div className="bg-white plr30 mb20å">
        <div
          className="flex jc-between ai-center border-bottom-one"
          style={{ height: "1.4rem" }}
        >
          <div className="flex">
            <div className="h80 w80 overflow-h common-img-bg circle">
              {item.member && item.member.headimgurl ? (
                <img
                  className="h-100 w-100"
                  src={item.member && item.member.headimgurl}
                  alt=""
                />
              ) : (
                <div className="h-100 w-100" />
              )}
            </div>
            <div
              className="pl20 font30 flex ai-center text-overflow-one"
              style={{ width: "1.8rem" }}
            >
              {item.fan && item.fan.nickname}
            </div>
          </div>
          <div className="flex">
            <div className="flex column lh100 ">
              <div className="font28 pb15 text-right">
                {surplusNum > 0 ? (
                  <span>
                    还差<span className="c-main plr5">{surplusNum}</span>人拼单完成
                  </span>
                ) : (
                  "拼单完成"
                )}
              </div>
              <div className="c999 font24 text-right">
                {surplusTime && surplusNum > 0
                  ? surplusTime.getdays > 0
                    ? `剩余时间 ${surplusTime.getdays}天`
                    : `剩余时间 ${surplusTime.getHours}:${
                        surplusTime.getMinutes
                      }:${surplusTime.getSeconds}`
                  : "时间到"}
              </div>
            </div>
            {surplusTime && surplusNum > 0 ? (
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
      </div>
    );
  }
}
