import React, { PureComponent } from "react";

export default class extends PureComponent {
  onTouchStart = (e) => {
    console.info(e.target)
  }
  render() {
    return (
      <div className="relative z10 overflow-h">
        <div
          style={{ height: "0.2rem" }}
          className="relative equal"
          ref={ele => (this.touchDiv = ele)}
          onTouchStart={this.onTouchStart}
        >
          {/* 当前播放的进度条 */}
          <div
            style={{
              position: "absolute",
              zIndex: 25,
              left: 0,
              top: "0.08rem",
              height: "0.05rem",
              background: "#45c2c8",
              width: "50%"
            }}
            className="r100"
          >
            <div
              style={{
                position: "absolute",
                zIndex: 20,
                top: 0,
                right: 0,
                width: "0.2rem",
                height: "0.2rem",
                borderRadius: "50%",
                border: "0.05rem solid rgba(69, 194, 200, 0.4)",
                backgroundClip: "content-box",
                transform: "translateX(-50%)"
              }}
              className="bg-main"
            />
          </div>
          {/* 已缓冲的进度条 */}
          <div
            style={{
              position: "absolute",
              zIndex: 15,
              left: 0,
              top: "0.08rem",
              height: "0.05rem",
              background: "#e4e4e4",
              width: "80%"
            }}
            className="r100"
          />
          {/* 播放总长度条，固定 */}
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              left: 0,
              top: "0.08rem",
              height: "0.05rem",
              background: "#b0b0b0",
              width: "100%"
            }}
            className="r100"
          />
        </div>
        <div className="flex jc-between c000 font24 mt5">
          {/* 当前播放时长 */}
          <span>24:00</span>
          {/* 总播放时长 */}
          <span>1:20:89</span>
        </div>
      </div>
    );
  }
}
