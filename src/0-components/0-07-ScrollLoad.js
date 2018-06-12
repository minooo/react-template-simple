import React from "react";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import { Toast } from "antd-mobile";
import { RequestStatus, SyncList } from "@components";
import { http, common } from "@utils";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      dataNoMore: false,
      isLoading: false,
      netBad: false
    };
    this.scrollDiv = React.createRef();
  }
  componentDidMount() {
    const { listenBody } = this.props;
    const listenEle = listenBody ? document.body : this.scrollDiv.current;
    listenEle.onscroll = this.onScroll;
    this.loadMore(this.props, false);
  }
  // componentWillReceiveProps(nextProps) {
  //   const diffDataPath = !isEqual(this.props.dataPath, nextProps.dataPath);
  //   const diffDataParam = !isEqual(this.props.dataParam, nextProps.dataParam);
  //   const diffRequest = !isEqual(this.props.request, nextProps.request);
  //   if ((diffDataPath || diffDataParam || diffRequest) && nextProps.canwork) {
  //     this.loadMore(nextProps, true);
  //   }
  // }
  componentDidUpdate(prevProps) {
    // forceUpdate 是布尔值，用于某些情况的强制刷新，比如订单列表的某些操作，通过将 forceUpdate 取反即可达到强制刷新的效果
    // canwork 用于某些情况禁止该组件不必要的下拉加载
    const { dataPath, dataParam, forceUpdate, canwork = true } = this.props
    const diffDataPath = !isEqual(dataPath, prevProps.dataPath);
    const diffDataParam = !isEqual(dataParam, prevProps.dataParam);
    const diffForceUpdate = !isEqual(forceUpdate, prevProps.forceUpdate);
    if ((diffDataPath || diffDataParam || diffForceUpdate) && canwork) {
      this.loadMore(this.props, true);
    }
  }
  onScroll = debounce(() => {
    // listenBody 指定监听滚动元素是body还是该组件的最外层div
    // canwork 用于某些情况禁止该组件不必要的下拉加载
    const { listenBody, canwork = true } = this.props;
    const listenEle = listenBody ? document.documentElement : this.scrollDiv.current;
    if (canwork) {
      this.scrollHandle(listenEle);
    }
  }, 300);
  loadMore = (props, isNewStart) => {
    const {
      dataParam = {},
      limit = 10,
      dataName = "data",
      loadSuccess,
      listenBody
    } = props;
    const { isLoading, dataNoMore, listData } = this.state;
    const listenEle = listenBody ? document.documentElement : this.scrollDiv.current;
    if (!isNewStart && (isLoading || dataNoMore)) return;
    if (isNewStart) {
      listenEle.scrollTop = 0;
      Toast.loading("加载中...");
    }
    this.setState(
      () => ({ isLoading: true }),
      () => {
        const offset = isNewStart ? 0 : listData.length;
        http
          .get({ ...dataParam, offset, limit })
          .then(response => {
            if (isNewStart) Toast.hide();
            // 这里的判断条件根据具体的接口情况而调整
            const { errcode, message } = response
            if (parseInt(errcode, 10) === 0) {
              const data = response[dataName];
              const dataNoMore = data ? data.length < limit : true;
              // 记录滚动条位置
              const h = listenEle.scrollTop;
              this.setState(
                preState => ({
                  listData: isNewStart
                    ? data
                    : preState.listData.concat(data || []),
                  dataNoMore,
                  isLoading: false
                }),
                () => {
                  listenEle.scrollTop = h;
                  if (loadSuccess) loadSuccess();
                }
              );
            } else if (parseInt(errcode, 10) === 402) {
              // token无效的特殊状态，需要特殊处理
              Toast.info(message || "token无效，请重新登陆")
              common.delCookie("token")
            } else if (errcode > 0) {
              Toast.info(message || "请求出错，请稍后重试！")
            }
          })
          .catch(err => {
            this.setState(() => ({ netBad: true }));
            console.info(err);
          });
      }
    );
  };

  scrollHandle = e => {
    // scrollTop 元素卷起来的高度
    // scrollHeight 元素总高度，包括被overflow 遮挡的不可见部分的高度
    // clientHeight 元素的可见高度
    if (this.state.isLoading || this.state.dataNoMore) return;
    const scrollPercent = Math.floor(
      e.scrollHeight - e.scrollTop - e.clientHeight
    );
    if (scrollPercent < 100) {
      this.loadMore(this.props, false);
    }
  };

  render() {
    const {
      listenBody,
      children,
      renderItem,
      listsClass,
      configNodata,
    } = this.props;
    const { listData, dataNoMore, netBad } = this.state;
    return (
      <div
        className={listenBody ? "" : "equal overflow-y relative"}
        ref={this.scrollDiv}
      >
        {children}

        {/* 主体列表输出 */}
        <div className={listsClass || ""}>
          {
            listData.length > 0 && (
              <SyncList items={listData} renderItem={renderItem} />
            )
          }
        </div>

        {/* 加载状态反馈 */}
        {netBad ? (
          <RequestStatus type="no-net" />
        ) : dataNoMore ? (
          listData.length > 0 ? (
            listData.length > 10 && <RequestStatus type="no-more" />
          ) : (
            configNodata || <RequestStatus type="no-data" />
          )
        ) : (
          <RequestStatus />
        )}
      </div>
    );
  }
}

/*
* 示例用法 非必需参数
* listsClass 如：prl30 bg-white
* dataParam  如：{type: "recomment"}
* limit 如：10
* listenBody 如要监听body滚动，则填写
* dataName(默认为data, 已和后端约定)
* loadSuccess 加载成功后的回调
* configNodata 自定义没有数据时的展示组件
* forceUpdate 是布尔值，用于某些情况的强制刷新，比如订单列表的某些操作，通过将 forceUpdate 取反即可达到强制刷新的效果
* canwork 用于某些情况禁止该组件不必要的下拉加载
* */

/*
<ScrollLoad
  dataName={{ action: "goods", operation: "list" }}
  renderItem={this.yourRender}
/>
*/
