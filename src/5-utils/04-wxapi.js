// 思考，把配置信息缓存
export const setConfig = config => {
  wx.config(config);
};
export const setShare = config => {
  const params = {
    title: config.title || "",
    desc: config.desc || "",
    imgUrl: config.imgUrl || "http://public.duduapp.net/new-media/app/static/avatar.png",
    link: config.link || window.location.href
  };
  wx.ready(() => {
    wx.onMenuShareAppMessage(params); // 分享给朋友
    wx.onMenuShareQQ(params); // 分享到QQ
    wx.onMenuShareWeibo(params); // 分享到腾讯微博
    wx.onMenuShareQZone(params); // 分享到QQ空间
    wx.onMenuShareTimeline(
      Object.assign({}, params, {
        title: `${params.title} ${params.desc}`
      })
    ); // 分享到朋友圈
  });
};

export const previewImage = (thumb, list) => {
  wx.previewImage({
    current: thumb, // 当前显示图片的http链接
    urls: list // 需要预览的图片http链接列表
  });
};

export const pay = params => new Promise((resolve, reject) =>
  wx.chooseWXPay({
    timestamp: params.timestamp,
    nonceStr: params.nonceStr,
    package: params.package,
    signType: params.signType,
    paySign: params.paySign,
    success: resolve,
    error: reject
  }))

// 选择图片
export const chooseImage = (params = {}) => new Promise((resolve) =>
  wx.chooseImage({
    count: params.count || 1,
    sizeType: params.sizeType || ["original"], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: params.sourceType || ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
    success: resolve // response.localIds 返回选定照片的本地ID列表，可作为img标签的src属性
  }))

// 上传图片接口
export const uploadImage = localId => new Promise((resolve) =>
  wx.uploadImage({
    localId,
    isShowProgressTips: 1,
    success: resolve // response.serverId
  }))
