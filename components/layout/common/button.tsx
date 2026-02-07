import { ButtonParams, FormButtonParams } from "@/lib/jespo/contracts";
import React from "react";
import { QuantitySelectorParams } from "@/lib/jespo/contracts";

export default function Button({
  label,
  disabled,
  outline,
  small,
  custom,
  isLoading,
  Icon,
  onClick,
}: ButtonParams): React.ReactElement {
  const buttonClassname = `disabled:opacity-70 disabled:cursor-not-allowed rounded-md 
        hover:opacity-80 w-full border-primary-700 flex items-center justify-center 
        gap-2 active:scale-95 transition
      ${outline ? "bg-white" : "bg-primary-700"}
      ${outline ? "text-primary-700" : "text-white"}
      ${small ? "text-sm font-light" : "text-md font-semibold"}
      ${small ? "py-1 px-2 border-[1px]" : "py-3 px-4 border-2"}
      ${custom ? custom : ""}`;

  return (
    <button onClick={onClick} className={buttonClassname} disabled={disabled}>
      {isLoading && (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
}

export function QuantitySelector({
  cartMode,
  cartCounter,
  cartProduct,
  handleQuantityIncrease,
  handleQuantityDecrease,
}: QuantitySelectorParams): React.ReactElement {
  const parentClassname = `flex gap-8 items-center`;
  const childClassname = `flex items-center text-base sm:gap-4
      ${cartMode ? "flex-col-reverse gap-1 sm:flex-row" : "flex-row gap-3"}`;

  const displayClassname = `font-semibold`;

  return (
    <div className={parentClassname}>
      {cartCounter ? null : <div className={displayClassname}>QUANTITY:</div>}

      <div className={childClassname}>
        <QuantitySelectorClicker
          symbol={"-"}
          onClick={handleQuantityDecrease}
        />
        <div>{cartProduct.quantity}</div>
        <QuantitySelectorClicker
          symbol={"+"}
          onClick={handleQuantityIncrease}
        />
      </div>
    </div>
  );
}

function QuantitySelectorClicker({
  symbol,
  onClick,
}: {
  symbol: string;
  onClick: () => void;
}) {
  const parentClassname = `border-[1.2px] border-primary-300 flex items-center justify-center
        w-7 h-7 rounded transition active:scale-[0.8] hover:bg-primary-50`;
  const childClassname = `pb-[2px]`;

  return (
    <button className={parentClassname} onClick={onClick}>
      <span className={childClassname}>{symbol}</span>
    </button>
  );
}
