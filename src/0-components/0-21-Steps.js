import React, { PureComponent } from "react";
import uuid from "uuid/v4";
import { WrapLink } from "@components";
import { parse } from "date-fns";

const config = [
  {
    text: "选择商品"
  },
  {
    text: "支付开团或参团"
  },
  {
    text: "等待用户参团支付"
  },
  {
    text: "达到人数拼团成功"
  }
];
export default class extends PureComponent {
  constructor(props) {
    super(props);
    const { time } = this.props;
    const milliseconds = parse(time);
    const remainMilliseconds = milliseconds - new Date();
    let timeOver = true;
    if (remainMilliseconds < 0) timeOver = false;
    this.state = {
      timeOver
    };
  }
  render() {
    const { step } = this.props;
    const { timeOver } = this.state;
    return (
      <div className=" plr30 bg-white">
        {/* 头部信息 */}
        <div className="flex jc-between ai-center border-bottom-one h92">
          <div>
            <span className="font34 bold c-main mr25">嘟嘟拼团</span>
            {timeOver ? (
              <span className="font24 c333">此商品正在参加拼团活动</span>
            ) : (
              <span className="font24 c333">此商品拼团活动已结束</span>
            )}
          </div>
          <WrapLink className=" c999 font24 flex ai-center" path="/group_rule">
            <span>规则说明</span>
            <i className="i-right" />
          </WrapLink>
        </div>
        {/* 步骤条 */}
        <div className="h40" />
        <div className=" flex relative">
          <div
            style={{ width: "80%", left: "10%", top: "0.22rem" }}
            className=" h16 bg-border absolute"
          >
            <div className={`bg-main h-100 r10 steps-progress-${step}`} />
          </div>
          {config.map((item, index) => (
            <div className=" equal" key={uuid()}>
              <div
                className={` ${
                  step > index
                    ? "w60 h60 bg-main c-white font30 bold mb20"
                    : "w50 h50 bg-border c999 font28 mt5 mb25"
                }  circle flex jc-center ai-center margin-auto relative z10`}
              >
                {index + 1}
              </div>
              <div
                style={{
                  width: "70%",
                  lineHeight: "0.36rem"
                }}
                className="font24 c666 lh100 text-center margin-auto"
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
        <div className="h40" />
      </div>
    );
  }
}
