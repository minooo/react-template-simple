import React from "react";
import { WrapLink } from "@components";

export default ({ imgList, imgSize, teamId, margin }) => (
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
            {index === 3 ? (
              <WrapLink
                path={`/group_members_${teamId}`}
                className={`font24 bold w${imgSize} h${imgSize} circle home-img-overflow flex jc-center ai-center`}
                style={{ transform: `translateX(${index * margin}rem)` }}
              >
                <i className="i-more font24" />
              </WrapLink>
            ) : (
              <img
                src={item.headimgurl || item.avatar}
                className={`w${imgSize} h${imgSize} circle common-img-bg`}
                style={{ transform: `translateX(${index * margin}rem)` }}
                alt=""
              />
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
