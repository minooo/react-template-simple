import React, { Component } from "react";
import { common, http } from "@utils";
import { Picker, Toast } from "antd-mobile";
import { Layout, NavBar, MyList } from "@components";

export default class extends Component {
  state = {
    data: [],
    city: [],
    cols: 3,
    cityDatas: [],
    sValue: []
  };
  componentDidMount() {
    this.onProvince();
    this.onCity(1);
    this.onAddress();
  }
  onAddress = () => {
    console.info(this.props.match);
    const { id } = this.props.match.params;
    if (id > 0) {
      this.setState({ id });
      http.getC({ action: "address", operation: "show", id }, data => {
        console.info(data);
        this.setState(() => ({
          name: data.data.name,
          mobile: data.data.mobile,
          address: data.data.address,
          isLongLogin: data.data.is_default
        }));
      });
    }
  };
  // 获取省
  onProvince = () => {
    http
      .get({ action: "region", operation: "province" })
      .then(response => {
        this.setState(() => ({
          data: response
        }));
      })
      .catch(() => {
        Toast.offline("抱歉，网络错误，请稍后再试。");
      });
  };
  // 获取市
  onCity = id => {
    http
      .get({ action: "region", operation: "area", id })
      .then(response => {
        this.setState(
          () => ({
            city: response
          }),
          () => {
            this.onMerge(id);
          }
        );
      })
      .catch(() => {
        Toast.offline("抱歉，网络错误，请稍后再试。");
      });
  };
  // 添加市区
  /* eslint-disable */
  onMerge = val => {
    const { data, city } = this.state;
    if (data.length === 0 || city.length === 0) {
      this.onProvince();
      this.onCity(1);
    } else {
      const asyncValue = [];
      const datas = data.map((item, index) => {
        if (index === val - 1) {
          asyncValue.push(val);
          if (!item.children) {
            item.children = city;
            asyncValue.push(city[0].value);
            asyncValue.push(city[0].children[0].value);
          }
        }
        return item;
      });
      this.setState(() => ({
        cityDatas: datas,
        sValue: asyncValue
      }));
    }
  };
  /* eslint-enable */
  // 滑动的时候
  onPickerChange = val => {
    if (val.length === 1) {
      this.onCity(val[0]);
    }
    if (val.length === 3) {
      this.setState({ sValue: val });
    }
  };
  onChange = (val, type) => {
    if (type === "name" || type === "address") {
      const { value } = val.target;
      this.setState(() => ({ [type]: value }));
    }
    if (type === "mobile") {
      const { value } = val.target;
      const reg = /^([1-9][0-9]*)?$/;
      if (reg.test(value)) {
        this.setState(() => ({ [type]: value }));
      }
    }
  };
  onSetting = () => {
    const { name, mobile, sValue, address } = this.state;
    if (!name) {
      Toast.info("请输入收货人姓名", 1);
    } else if (!mobile) {
      Toast.info("您的联系电话不能为空。", 1);
    } else if (!common.isMobile(mobile)) {
      Toast.info("您的联系电话格式有误，请检查。", 1);
    } else if (!address) {
      Toast.info("请输入详细地址信息。", 1);
    } else {
      Toast.loading("保存地址中");
      http.postC(
        {
          action: "address",
          operation: "store",
          name,
          mobile,
          province_id: sValue[0],
          city_id: sValue[1],
          county_id: sValue[2],
          address
        },
        () => {
          Toast.success("收货地址保存成功", 1, () => {
            if (window && window.history && window.history.length > 1) {
              window.history.go(-1);
            }
          });
        }
      );
    }
  };
  onEditor = id => {
    console.info("我执行的是修改操作");
    const { name, mobile, sValue, address } = this.state;
    if (!id) {
      Toast.info("没有地址id", 2);
    } else if (!name) {
      Toast.info("请输入收货人姓名", 2);
    } else if (!mobile) {
      Toast.info("您的联系电话不能为空。", 1);
    } else if (!common.isMobile(mobile)) {
      Toast.info("您的联系电话格式有误，请检查。", 2);
    } else if (!address) {
      Toast.info("请输入详细地址信息。", 2);
    } else {
      Toast.loading("保存地址中");
      http.putC(
        {
          action: "address",
          operation: "update",
          id,
          name,
          mobile,
          province_id: sValue[0],
          city_id: sValue[1],
          county_id: sValue[2],
          address
        },
        () => {
          Toast.success("收货地址编辑成功", 1, () => {
            if (window && window.history && window.history.length > 1) {
              window.history.go(-1);
            }
          });
        }
      );
    }
  };
  render() {
    const { name, mobile, address, cols, cityDatas, sValue, id } = this.state;
    return (
      <Layout title={`${id ? "编辑" : "添加"}收货地址`}>
        <div className="equal overflow-y">
          <NavBar title={`${id ? "编辑" : "添加"}收货地址`} />
          <div className=" plr30 bg-white">
            <div className=" h88 flex ai-center border-bottom-one">
              <div className="font28 c333">收货人：</div>
              <input
                className="w-100 h40 reset equal my-input-reset"
                type="text"
                placeholder=""
                value={name || ""}
                onChange={val => this.onChange(val, "name")}
              />
            </div>
            <div className=" h88 flex ai-center border-bottom-one">
              <div className="font28 c333">手机号码：</div>
              <input
                className="w-100 h40 reset equal my-input-reset"
                type="tel"
                placeholder=""
                value={mobile || ""}
                onChange={val => this.onChange(val, "mobile")}
              />
            </div>
            <Picker
              data={cityDatas}
              title="选择地区"
              value={sValue}
              cols={cols}
              onPickerChange={this.onPickerChange}
            >
              <MyList>
                <div className="font28 c333">所在地区:</div>
              </MyList>
            </Picker>
            <div className=" flex   my-input-reset">
              <div className="font28 c333 mt30">详细地址：</div>
              <textarea
                className="ptb30 plr30 reset equal my-input-reset font28"
                placeholder="请输入详细地址信息，如门牌号等"
                maxLength={60}
                rows={5}
                value={address || ""}
                onChange={val => this.onChange(val, "address")}
              />
            </div>
            {/* <div className=" h88 flex jc-between ai-center">
              <div className="font28 c333">设置为默认地址</div>
              <Checkbox
                className="add-checkbox-rest"
                checked={isLongLogin}
                onChange={val => this.onChange(val, "login")}
              />
            </div> */}
          </div>
          <div className=" plr30">
            <div className="h44" />
            <button
              className=" c-white font30 w-100 h80 bg-main r10"
              onClick={id ? () => this.onEditor(id) : () => this.onSetting()}
            >
              保存
            </button>
          </div>
        </div>
      </Layout>
    );
  }
}
