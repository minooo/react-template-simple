import React from "react";
import { WrapLink } from "@components";

const Avatar = ({ item, isFirst }) => (
  <div className="w90 h90 relative circle relative mr20" key={item.id}>
    <img src={item.avatar} className="w-100 h-100 circle" alt={item.nickname} />
    {isFirst && (
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

const Add = () => (
  <div className="w90 h90 circle home-img-overflow flex jc-center ai-center mr20 bg-bo">
    <i className="i-add font30 bold" />
  </div>
);

const More = ({ teamId }) => (
  <WrapLink
    path={`/group_members_${teamId}`}
    className="w90 h90 circle home-img-overflow flex jc-center ai-center mr20"
  >
    <i className="i-more font34" />
  </WrapLink>
);

export default ({ imgList, offerd_num, teamId }) => (
  <div className="flex jc-center" style={{ marginRight: "-0.2rem" }}>
    <Avatar item={imgList[0]} isFirst />
    {imgList[1] ? <Avatar item={imgList[1]} /> : <Add />}
    {imgList[2] ? (
      imgList.length > 3 ? (
        offerd_num !== imgList.length ? (
          <More teamId={teamId} />
        ) : (
          <Avatar item={imgList[2]} />
        )
      ) : (
        <Avatar item={imgList[2]} />
      )
    ) : (
      offerd_num > 2 && imgList[1] && <Add />
    )}
    {imgList[3] ? (
      offerd_num === 4 ? (
        <Avatar item={imgList[3]} />
      ) : offerd_num === imgList.length ? (
        <More teamId={teamId} />
      ) : (
        <Add />
      )
    ) : (
      offerd_num > 3 && imgList[2] && <Add />
    )}
  </div>
);
