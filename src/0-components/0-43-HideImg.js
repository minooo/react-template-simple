import React from "react";
import { WrapLink } from "@components";

export default ({ imgList, imgSize, teamId, margin, teaming, team }) => (
  <div className="flex ">
    {imgList &&
      imgList.length > 0 &&
      imgList.map((item, index) => {
        if (index > 3) {
          return false;
        }
        return (
          /* eslint-disable */
          <div key={index} className="relative">
            {/* eslint-enable */}
            {index === (teaming ? 2 : 3) ? (
              <WrapLink
                path={`/group_members_${teamId}`}
                className={`font24 bold w${imgSize} h${imgSize} circle home-img-overflow flex jc-center ai-center`}
                style={
                  team
                    ? { marginLeft: `${margin}rem` }
                    : { transform: `translateX(${index * margin}rem)` }
                }
              >
                <i className={`i-more ${team ? "font34" : "font24"}`} />
              </WrapLink>
            ) : teaming && index === 3 ? (
              <div
                className={`font24 bold w${imgSize} h${imgSize} circle home-img-overflow flex jc-center ai-center`}
                style={
                  team
                    ? { marginLeft: `${margin}rem` }
                    : { transform: `translateX(${index * margin}rem)` }
                }
              >
                <i className="i-add font34" />
              </div>
            ) : (
              <img
                src={item.headimgurl}
                className={`w${imgSize} h${imgSize} circle common-img-bg`}
                style={
                  team
                    ? { marginLeft: `${index === 0 ? "0rem" : `${margin}rem`}` }
                    : { transform: `translateX(${index * margin}rem)` }
                }
                alt=""
              />
            )}
            {team &&
              index === 0 && (
                <div
                  style={{
                    borderRadius: "0.16rem",
                    left: "0.15rem",
                    bottom: "-0.2rem",
                    padding: "0.05rem 0.07rem"
                  }}
                  className=" bg-main font24 c-white text-center absolute"
                >
                  团长
                </div>
              )}
          </div>
        );
      })}
  </div>
);

// imgList 图片列表
// imgSize={90} 图片大小 class的大小 20~120
// teamId={1}   拼团id用于跳往参与人列表
// margin={0.20}  图片间距 rem值
// teaming 拼团中
// team 是拼团详情还是拼团列表

