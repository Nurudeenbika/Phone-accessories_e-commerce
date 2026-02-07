import React from "react";
import {
  CartContentParams,
  CartImageSettingsParams,
  CartLinkedImageItemParams,
  CartLinkedImageParams,
  QuantitySelectorParams,
} from "@/lib/jespo/contracts";
import Link from "next/link";
import Image from "next/image";
import { QuantitySelector } from "@/components/layout/common/button";

export default function CartContent({
  item,
}: CartContentParams): React.ReactElement {
  const parentClassname = `grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px]
        border-primary-200 py-4 items-center`;

  return (
    <div className={parentClassname}>
      <CartLinkedImage
        image={item.selectedImg.image}
        name={item.name}
        url={`/product/${item.id}`}
        color={item.selectedImg.color}
        onClick={() => {}}
      />
      <CartPricing price={item.price} isTotal={false} />

      <CartQuantity
        cartMode={true}
        cartCounter={true}
        cartProduct={item}
        handleQuantityIncrease={() => {}}
        handleQuantityDecrease={() => {}}
      />

      <CartPricing price={item.price * item.quantity} isTotal={true} />
    </div>
  );
}

function CartLinkedImage({
  image,
  name,
  url,
  color,
  onClick,
}: CartLinkedImageParams): React.ReactElement {
  const parentClassname = `col-span-2 justify-self-start flex gap-2 md:gap-4`;

  return (
    <div className={parentClassname}>
      <CartLinkedImageItem image={image} name={name} url={url} />
      <CartImageSettings
        name={name}
        url={url}
        color={color}
        onClick={onClick}
      />
    </div>
  );
}

function CartLinkedImageItem({
  image,
  name,
  url,
}: CartLinkedImageItemParams): React.ReactElement {
  const parentClassname = `relative w-[70px] aspect-square`;
  const imageClassname = `object-contain`;

  return (
    <Link href={url}>
      <div className={parentClassname}>
        <Image src={image} alt={name} fill className={imageClassname} />
      </div>
    </Link>
  );
}

function CartImageSettings({
  name,
  url,
  color,
  onClick,
}: CartImageSettingsParams): React.ReactElement {
  const parentClassname = `flex flex-col justify-between`;
  const buttonContainerClassname = `w-[70px]`;
  const buttonClassname = `text-primary-500 underline`;

  return (
    <div className={parentClassname}>
      <Link href={url}>{name}</Link>
      <div>{color}</div>
      <div className={buttonContainerClassname}>
        <button
          className={buttonClassname}
          onClick={() => {
            onClick();
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function CartPricing({
  price,
  isTotal,
}: {
  price: number;
  isTotal: boolean;
}): React.ReactElement {
  const parentClassname = `${isTotal ? "justify-self-end font-semibold" : "justify-self-center pl-4 sm:pl-0"}`;

  return <div className={parentClassname}>{price}</div>;
}

function CartQuantity({
  cartMode,
  cartCounter,
  cartProduct,
  handleQuantityIncrease,
  handleQuantityDecrease,
}: QuantitySelectorParams): React.ReactElement {
  const parentClassname = `justify-self-center pl-4 sm:pl-0`;

  return (
    <div className={parentClassname}>
      <QuantitySelector
        cartMode={cartMode}
        cartCounter={cartCounter}
        cartProduct={cartProduct}
        handleQuantityIncrease={handleQuantityIncrease}
        handleQuantityDecrease={handleQuantityDecrease}
      />
    </div>
  );
}

export function CartTopics() {
  const parentClassname = `grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8`;
  const firstTopicClassname = `col-span-2 justify-self-start`;
  const middleTopicClassname = `justify-self-center pl-4 sm:pl-0`;
  const lastTopicClassname = `justify-self-end`;

  return (
    <div className={parentClassname}>
      <div className={firstTopicClassname}>PRODUCT</div>
      <div className={middleTopicClassname}>PRICE</div>
      <div className={middleTopicClassname}>QUANTITY</div>
      <div className={lastTopicClassname}>TOTAL</div>
    </div>
  );
}
