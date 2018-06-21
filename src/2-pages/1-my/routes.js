import Loadable from "react-loadable";
import { Loading } from "@components";

const loadPage = path =>
  Loadable({
    loader: () => import(`./${path}`),
    loading: Loading
  });

export default [
  {
    path: "/my",
    component: loadPage("0-home")
  },
  {
    path: "/details_:id",
    component: loadPage("2-group-details-new")
  },
  {
    path: "/group_members_:id",
    component: loadPage("3-group-members")
  },
  {
    path: "/address",
    component: loadPage("4-address")
  },
  {
    path: "/add_address_:id",
    component: loadPage("5-add-address")
  },
  {
    path: "/retreat_:id",
    component: loadPage("6-retreat")
  },
  {
    path: "/logistics_:id",
    component: loadPage("7-logistics")
  },
  {
    path: "/write_comment_:id",
    component: loadPage("8-write-comment")
  },
  {
    path: "/order_list",
    component: loadPage("10-order-list")
  },
  {
    path: "/order_details_:id",
    component: loadPage("11-order-details")
  },
  {
    path: "/submit_order",
    component: loadPage("12-submit-order")
  },
  {
    path: "/pay",
    component: loadPage("13-pay")
  },
  {
    path: "/pay_details",
    component: loadPage("14-pay-details")
  },
  {
    path: "/back_cause_:id",
    component: loadPage("15-back-cause")
  }
];
