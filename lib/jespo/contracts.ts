import {
  CartProductType,
  ImageType,
  SelectedImageType,
} from "@/lib/jespo/types";
import React from "react";
import { IconType } from "react-icons";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { ProductAttributes } from "@/models/product.model";
import { OrderAttributes } from "@/models/order.model";
import { UserAttributes } from "@/models/user.model";
import { GraphData } from "@/lib/jespo/types";

export interface LoggedInUserParams {
  loggedInUser: UserAttributes | null;
}

export interface ContainerParams {
  children: React.ReactNode;
}

export interface ClickableContainerParams {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export interface AvatarParams {
  src?: string | null | undefined;
}

export interface EmptyPageParams {
  title: string;
  subtitle?: string | null;
}

export interface FooterLinkParams {
  url?: string | null;
  label: string;
  classname: string;
  Icon?: IconType | null;
}

export interface FooterListParams {
  header?: string | null;
  children: React.ReactNode;
}

export interface UseCategoryParams {
  title: string;
  label?: string | null;
}

export interface ProductCategoryParams {
  label?: string | null;
  icon: IconType;
  selected?: boolean;
}

export interface AboutCompanyParams {
  header: string;
  body: string;
  copyright?: string | null;
}

export interface SimpleContainerParams {
  classname?: string | null;
  children: React.ReactNode;
}

export interface ProductImageParams {
  src?: string | null;
  label?: string | null;
}

export interface ProductNameParams {
  name: string;
}

export interface RatingParams {
  value: number;
  numberOfReviews: number;
}

export interface StatusParams {
  text: string;
  Icon: IconType;
  background: string;
  color: string;
}

export interface ProductPriceParams {
  offerAvailable: boolean;
  price: number;
}

export interface ProductShippingInfoParams {
  offerAvailable: boolean;
  info: string;
}

export interface ProductCardParams {
  productId?: string;
}

export interface ProductTileParams {
  products: ProductAttributes[];
}

export interface GetProductListParams {
  category?: string | null;
  searchQuery?: string | null;
}

export interface GetProductListWithLimitParams {
  category?: string | null;
  page?: number | null;
  limit?: number | null;
}

export interface HeadingParams {
  title: string;
  center?: boolean;
  custom?: string;
}

export interface TextFieldParams {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

export interface ButtonParams {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  isLoading?: boolean;
  Icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface FormButtonParams {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  isLoading?: boolean;
  Icon?: IconType;
}

export interface HorizontalLineParams {
  or?: boolean;
}

export interface LoginFormParams {
  loggedInUser: UserAttributes | null;
}

export interface AddressAttributes {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
  phone?: string;
  address?: string;
}

export interface CartProductTypeAttributes {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImage: string;
  quantity: number;
  price: number;
}

export interface AdminLinkParams {
  path: string;
  label: string;
  Icon: IconType;
  selected?: boolean;
}

export interface AdminSummaryParams {
  products: ProductAttributes[];
  orders: OrderAttributes[];
  users: UserAttributes[];
}

export interface HeadingParams {
  title: string;
  center?: boolean;
  custom?: string;
}

export interface AdminSummaryBodyParams {
  topic: string;
  label: string;
  value: number;
}

export interface BarGraphParams {
  data: GraphData[];
}

export interface CustomCheckBoxParams {
  id: string;
  label: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}

export interface AddProductSelectCategoryContainerParams {
  categories: React.ReactNode;
  colors: React.ReactNode;
}

export interface CategoryInputParams {
  selected?: boolean;
  label: string;
  Icon: IconType;
  onClick: (value: string) => void;
}

export interface ColorSelectorParams {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isProductCreated: boolean;
  previousImages?: SelectedImageType[];
}

export interface ImageSelectorParams {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}

export interface ItemParams {
  productId?: string;
}

export interface CartContentParams {
  item: CartProductType;
}

export interface QuantitySelectorParams {
  cartMode?: boolean;
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQuantityIncrease: () => void;
  handleQuantityDecrease: () => void;
}

export interface CartLinkedImageParams {
  image: string;
  name: string;
  url: string;
  color: string;
  onClick: () => void;
}

export interface CartLinkedImageItemParams {
  image: string;
  name: string;
  url: string;
}

export interface CartImageSettingsParams {
  name: string;
  url: string;
  color: string;
  onClick: () => void;
}

export interface EmptyCartParams {
  title: string;
  subtitle: string;
  url: string;
}

export interface ProductCardProps {
  product: ProductAttributes;
  index?: number;
}
