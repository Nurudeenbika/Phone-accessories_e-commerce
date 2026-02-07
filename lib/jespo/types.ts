import { Options } from "sequelize";
import { IconType } from "react-icons";
import { User } from "@/models/user.model";

export interface DatabaseConfiguration extends Options {
  use_env_variable?: string;
}

export type Environment = "development" | "test" | "production";

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type LoggedInUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type ProductCategory = {
  title: string;
  label: string;
  Icon: IconType;
};

export type LinkItem = {
  label: string;
  url?: string | null;
  Icon?: IconType | null;
};

export type SummaryDataType = {
  [key: string]: {
    label: string;
    digit: number;
  };
};

export type GraphData = {
  day: string;
  date: string;
  totalAmount: number;
  totalOrders: number;
};

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type SelectedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

export type UserSession = {
  sessionToken: string;
  userId: string;
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  expires: Date | null;
};

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImageType;
  quantity: number;
  price: number;
};

export type CartContextType = {
  cartTotalQuantity: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  paymentIntent: string | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQuantityIncrease: (product: CartProductType) => void;
  handleCartQuantityDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  handleSetPaymentIntent: (value: string | null) => void;
  handleRemovePaymentIntent: () => void;
};
