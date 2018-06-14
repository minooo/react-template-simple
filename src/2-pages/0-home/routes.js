import Loadable from "react-loadable"
import { Loading } from "@components"

const loadPage = path => Loadable({
  loader: () => import(`./${path}`),
  loading: Loading
})

const Home = loadPage("0-home")
const ProductDetail = loadPage("1-product-detail")
const CommentList = loadPage("2-comment-list")
const GroupList = loadPage("3-group-list")
const GroupRule = loadPage("4-group-rule")
export default [
  {
    path: "/",
    component: Home
  },
  {
    path: "/product_detail_:id",
    component: ProductDetail
  },
  {
    path: "/comment_list_:id",
    component: CommentList
  },
  {
    path: "/group_list",
    component: GroupList
  },
  {
    path: "/group_rule",
    component: GroupRule
  }
];

// import Loadable from "react-loadable"
// import RequestStatus from "@components"
// import Home from "./0-home";
// import ProductDetail from "./1-product-detail";
// import CommentList from "./2-comment-list";
// import GroupList from "./3-group-list";

// export default [
//   {
//     path: "/",
//     component: Home
//   },
//   {
//     path: "/product_detail_:id",
//     component: ProductDetail
//   },
//   {
//     path: "/comment_list",
//     component: CommentList
//   },
//   {
//     path: "/group_list",
//     component: GroupList
//   }
// ];
