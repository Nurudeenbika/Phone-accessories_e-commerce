import { MdSmartphone, MdOutlineKeyboard } from "react-icons/md";
import { ProductCategory } from "@/lib/jespo/types";

export const productCategories: ProductCategory[] = [
  {
    title: "Phones",
    label: "phone",
    Icon: MdSmartphone,
  },
  {
    title: "Phone Accessories",
    label: "phone-accessories",
    Icon: MdOutlineKeyboard,
  },
];
