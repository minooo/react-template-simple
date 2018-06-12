import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div className="flex column jc-center ai-center" style={{ height: "100vh" }}>
    <span className="font26">404!页面没有找到，请</span>
    <Link to="/" className="font36 c-main">
      返回首页
    </Link>
  </div>
);
