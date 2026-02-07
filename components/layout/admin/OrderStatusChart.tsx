import dynamic from "next/dynamic";

const OrderStatusChart = dynamic(
    () => import("./OrderStatusChart.client"),
    {  ssr: false },
);

export default OrderStatusChart;