import dynamic from "next/dynamic";

const CategoryChart = dynamic(
    () => import("./CategoryChart.client"),
    {  ssr: false },
);

export default CategoryChart;