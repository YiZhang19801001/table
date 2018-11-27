import Payment from "./components/Payment.vue";
import Order from "./components/Order.vue";
import Menu from "./components/Menu.vue";
import Confirm from "./components/Confirm.vue";
import PreorderConfrim from "./components/PreorderConfirm.vue";
import Preorder from "./components/Preorder.vue";

export const routes = [
    //<- all router configrations goes here.

    { path: "/table/public/table/:table/orderid/:orderid", component: Order },
    {
        path: "/table/public/table/:table/orderid/:orderid/payment",
        component: Payment
    },
    {
        path: "/table/public/table/:table/orderid/:orderid/confirm",
        component: Confirm
    },
    {
        path: "/table/public/confirm",
        component: PreorderConfrim
    },
    {
        path: "/table/public/preorder",
        component: Preorder
    },
    { path: "/table/public/menu", component: Menu }
];
