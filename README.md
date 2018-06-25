#嘟嘟拼团插件项目前端

## 前端约定

* [next.js 6 文档](https://nextjs.org/docs/#setup)
* 前期没图片的情况下，一律使用这个格式的图片，https://dummyimage.com/600x400，自定义图片参照这个格式 想玩点花样可以 https://dummyimage.com/600x400/ff0/f00&text=plugin
* 人民币的符号统一使用 `¥`
* 测试 http://plugins.duduapp.net/
* 模拟登陆 http://mp.dev.duduapp.net/h5/zKB4Db0a2PVqyV8YPve3?token=NkFtSlpUZFNrd1QxbUZRWkRCSExSUT09
* 本地网址 http://mp.duduapp.localhost/#/
* 填坑大全之如果支付出现问题，首先排查 Window.AppConfig.wx.jsConfig 是否有值，然后看url中#前面是否有 ?index, 最后是吊起支付时，传的支付参数是否对应。

## 后端约定

以下建议是根据近期项目开发总结而来，请各位务必认真对待。有问题随时提，我们要将此作为今后的约定规范

* 所有请求的数据统一用 data 作为键名

* 请求数据的状态字段为 errcode（0 表示成功，其他后端商定），值类型必须为数字；消息字段为 msg，值类型必须为字符串，这俩字段每个接口都必须返回。

* 一些极常用的约定字段关于物的标题，副标题，内容 分别为 ：title, caption, con；关于人的标题，副标题，内容 分别为 ：nickname (real_name, 如果需要）, intro, con，产品/人物 的 id 是必须的，创建时间 created_time (其他涉及时间的，统一用 xxx_time 的格式) 手机号 mobile 地址 address
  缩略图 thumb (thumb 统一用于列表中的图片字段，image(s)用于详情里的图片)，头像，avatar，价格 price (优惠价：low_price)
  其他字段，按需发挥，但是尽量简明扼要，统一下划线命名

## 公共组件库

### Data Display

#### 1.0 Steps 步骤条

##### 代码演示

```
import { Steps } from "@components";

<Steps step={3} />
```

| 属性 |          说明          |  类型  | 默认值 |
| :--: | :--------------------: | :----: | :----: |
| step | 制定当前步骤，从 1~4。 | number |   -    |

### 倒计时

```js
// 引入格式化时间插件
  import { parse } from "date-fns";
  // 创建一个state获取函数返回值
  state = {
    surplusTime: ""
  };
// 设置定时器
  componentDidMount() {
    // 格式化传入时间
    const upDateParse = parse(this.props.item.time);
    this.interval = setInterval(
      () => this.timeUpdate(upDateParse, this.interval),
      1000
    );
  }
  // 结束时消除定时器
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  // 创建定时函数
   timeUpdate = (upDateParse, interval) => {
    this.setState(() => ({
      surplusTime: countDown(upDateParse, interval)
    }));
  };

  // 返回值为
  {
    getdays,天数
    getHours,小时数
    getMinutes,分钟数
    getSeconds 秒数
  };
  // 当时间已经低于现在时间返回false
```
