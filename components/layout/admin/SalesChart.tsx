import dynamic from "next/dynamic";

const SalesChart = dynamic(
    () => import("./SalesChart.client"),
    {  ssr: false },
);

export default SalesChart;