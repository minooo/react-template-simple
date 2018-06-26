import React from "react";
import { withRouter } from "react-router";
import { WrapLink } from "@components";

@withRouter
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.onSwitch = this.onSwitch.bind(this);
  }
  componentDidUpdate(preProps) {
    if (this.props.isInit !== preProps.isInit) {
      // eslint-disable-next-line
      this.setState(() => ({ isOpen: false }))
    }
  }
  onSwitch() {
    this.setState(
      pre => ({ isOpen: !pre.isOpen }),
      () => {
        console.info(this.state.isOpen);
      }
    );
  }

  render() {
    const { isOpen } = this.state;
    const {
      isGhost,
      leftCon = true,
      leftClick,
      title,
      rightCon,
      rightShare
    } = this.props;
    return (
      <div
        className={`flex ai-center h88 pr30 pl30 relative z10 equal-no ${
          isGhost ? "" : "bg-main"
        }`}
      >
        {isOpen && (
          <div className="home-share" onClick={this.onSwitch}>
            <img
              src="http://public.duduapp.net/new-media/app/static/share.png"
              className="w-100"
              alt=""
            />
          </div>
        )}
        {leftCon ? (
          <WrapLink
            className="equal-auto text-left pt5"
            onClick={() => {
              if (leftClick) {
                leftClick();
              } else if (
                window &&
                window.history &&
                window.history.length > 1
              ) {
                window.history.go(-1);
              } else {
                this.props.history.push("/")
              }
            }}
          >
            <i className="i-left font40 c-white" />
          </WrapLink>
        ) : (
          <div className="equal-auto" />
        )}

        <div className="font34 bold pt5 c-white equal3 text-overflow-one text-center">
          {title || ""}
        </div>

        {rightCon ||
          (rightShare ? (
            <WrapLink className="equal-auto text-right pt5" onClick={this.onSwitch}>
              <i className="i-share font40 c-white" />
            </WrapLink>
          ) : (
            <div className="equal-auto" />
          ))}
      </div>
    );
  }
}
