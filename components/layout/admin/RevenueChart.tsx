import dynamic from "next/dynamic";

const RevenueChart = dynamic(
    () => import("./RevenueChart.client"),
    { ssr: false },
);

export default RevenueChart;