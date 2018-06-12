import React, { PureComponent, Fragment } from "react";
import uuid from "uuid/v4";
import { WrapLink } from "@components";

export default class extends PureComponent {
  state = { isOpen: false };
  componentDidMount() {
    this.goActive()
  }
  componentDidUpdate() {
    this.goActive()
  }
  onSwitch = () => {
    this.setState(pre => ({ isOpen: !pre.isOpen }));
  };
  onClick = (index, id) => {
    const { localfocus } = this.state
    const { onFilterClick } = this.props;
    this.setState(
      () => ({ isOpen: false, localfocus: index }),
      () => {
        if (localfocus !== index) onFilterClick(id);
      }
    );
  };
  goActive = () => {
    const { localfocus } = this.state
    const { focus = 0 } = this.props
    const left = this[`mybtn${localfocus === undefined ? focus : localfocus}`].offsetLeft
    this.myXBox.scrollLeft = left - 60
  }
  render() {
    const { isOpen, localfocus } = this.state;
    const { filters, modalTop = 0, focus = 0 } = this.props;
    return (
      <Fragment>
        <div className="equal-no flex h68 relative">
          <div className="absolute z10 w40 common-filter-pre" />
          <div
            className={`absolute z10 w40 ${
              filters.length > 4
                ? "common-filter-next"
                : "common-filter-next-oth"
            }`}
          />
          <div ref={ele => this.myXBox = ele} className="equal flex overflow-x ai-stretch common-hide-scrollbar">
            {filters && filters.length > 0 && filters.map((item, index) => (
              <button
                key={uuid()}
                className="plr25 equal-no"
                onClick={() => this.onClick(index, item.id)}
                ref={ele => this[`mybtn${index}`] = ele}
              >
                <div
                  className={`font30 c000 h68 flex ai-center ${
                    (localfocus === undefined ? focus : localfocus) === index ? "common-filter-active bold" : ""
                  }`}
                >
                  {item.name}
                </div>
              </button>
            ))}
          </div>
          {filters.length > 4 && (
            <WrapLink
              className="w90 flex ai-center jc-center"
              onClick={this.onSwitch}
            >
              <i className="i-switch font30 c000" />
            </WrapLink>
          )}
        </div>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              top: modalTop,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              backgroundColor: "rgba(255, 255, 255, 0.9)"
            }}
            className="flex column"
          >
            <div className="h74 plr30 flex jc-between ai-center">
              <div className="font30 c000 bold">切换频道</div>
              <WrapLink className="pt5" onClick={this.onSwitch}>
                <i className="i-close-o font34 c000" />
              </WrapLink>
            </div>

            <div className="flex pl30 wrap overflow-y">
              {filters && filters.length > 0 && filters.map((item, index) => (
                <WrapLink
                  key={uuid()}
                  className={`mr30 h66 r10 mb30 font24 text-overflow-one ${
                    (localfocus === undefined ? focus : localfocus) === index
                      ? "common-filter-btn-active c-main"
                      : "common-filter-btn c999"
                  }`}
                  onClick={() => this.onClick(index, item.id)}
                >
                  {item.name}
                </WrapLink>
              ))}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
