import React, { Component } from "react";
import { Checkbox, Toast, Modal } from "antd-mobile";
import { http, common } from "@utils";
import { Layout, NavBar, WrapLink } from "@components";

const { alert } = Modal;

export default class extends Component {
  state = {};
  componentDidMount() {
    this.onAddress();
  }
  onAddress = () => {
    http.getC(
      {
        action: "address",
        operation: "list"
      },
      data => {
        console.info(data);
        this.setState(() => ({
          data: data.data
        }));
      }
    );
  };
  onDelete = id => {
    console.info("11");
    http.deleteC({ action: "address", operation: "destroy", id }, () => {
      Toast.success("删除成功", 2, () => {
        this.onAddress();
      });
    });
  };
  onChange = (val, type, id) => {
    if (type === "login") {
      const { checked } = val.target;
      console.info(checked);
      if (checked) {
        http.postC(
          {
            action: "address",
            operation: "setDefault",
            id
          },
          () => {
            Toast.success("设置默认地址成功", 2, () => {
              this.onAddress();
            });
          }
        );
      }
    }
  };
  goSubmitOrder = () => {
    const paramsObj = common.searchToObj();
    const { con } = paramsObj
    const { history } = this.props;
    if (con) {
      const paramsStr = common.serializeParams(paramsObj);
      history.push(`/submit_order?${paramsStr}`);
    } else {
      window.history.go(-1);
    }
  };
  render() {
    const { data } = this.state;
    return (
      <Layout title="地址管理">
        <div className="equal overflow-y">
          <NavBar title="地址管理" leftClick={this.goSubmitOrder} />
          {data &&
            data.length > 0 &&
            data.map(item => (
              <div key={item.id}>
                <div className=" plr30 bg-white">
                  <div className="ptb30 border-bottom-one">
                    <div className=" flex jc-between">
                      <div className=" font30 c333">
                        <span className=" mr30">{item.name}</span>
                        <span>{item.mobile}</span>
                      </div>
                      {item.is_default && (
                        <div
                          style={{
                            borderRadius: "0.16rem",
                            padding: "0.05rem 0.07rem"
                          }}
                          className="bg-main font24 c-white text-center lh100"
                        >
                          默认
                        </div>
                      )}
                    </div>
                    <div className=" c999 font24 mt20">
                      {item.province}
                      {item.city}
                      {item.county}
                      {item.address}
                    </div>
                  </div>
                  <div className=" h90 flex jc-between ai-center">
                    <Checkbox
                      checked={item.is_default}
                      onChange={val => this.onChange(val, "login", item.id)}
                      className=" font24 c333 flex ai-center add-checkbox-rest"
                    >
                      <span className="ml15">设为默认地址</span>
                    </Checkbox>
                    <div className="c333 flex ">
                      <WrapLink
                        path={`/add_address_${item.id}`}
                        className="mr30 font24 flex ai-center"
                      >
                        <i className="i-edit font30 mr10" />编辑
                      </WrapLink>
                      <WrapLink
                        onClick={() =>
                          alert("确定要删除该地址吗?", "", [
                            { text: "取消" },
                            {
                              text: "删除",
                              onPress: () => this.onDelete(item.id)
                            }
                          ])
                        }
                        className="ml10 font24 flex ai-center"
                      >
                        <i className="i-delete font30 mr10" />删除
                      </WrapLink>
                    </div>
                  </div>
                </div>
                <div className="h20" />
              </div>
            ))}
          <div className=" plr30">
            <div className="h60" />
            <WrapLink
              className=" h80 r10 bg-main w-100 c-white flex jc-center ai-center"
              path="/add_address_0"
            >
              <i className=" i-add font30 c-white mr10" />添加新地址
            </WrapLink>
          </div>
        </div>
      </Layout>
    );
  }
}
