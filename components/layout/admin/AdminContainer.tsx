import Container from "@/components/layout/base/container";
import React from "react";
import {
  ContainerParams,
  AddProductSelectCategoryContainerParams,
} from "@/lib/jespo/contracts";
import { FormWrap } from "@/components/layout/common/forms";

export default function AdminContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = `w-full shadow-xl border-b-[0.5px] bg-primary-300`;
  const childClassname = `flex flew-wrap items-center pt-1 justify-between md:justify-center gap-4 md:gap-12 overflow-x-auto`;

  return (
    <div className={parentClassname}>
      <Container>
        <div className={childClassname}>{children}</div>
      </Container>
    </div>
  );
}

export function AdminPageContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = `pt-8`;

  return (
    <div className={parentClassname}>
      <Container>{children}</Container>
    </div>
  );
}

export function AdminSummaryContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = `max-w-[1150px] m-aut`;

  return <div className={parentClassname}>{children}</div>;
}

export function AdminSummaryBodyContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = `grid grid-cols-2 gap-3 max-h-50vh overflow-y-auto`;

  return <div className={parentClassname}>{children}</div>;
}

export function AdminAddProductFormTextFieldContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = `flex w-full gap-3`;

  return <div className={parentClassname}>{children}</div>;
}

export function AdminAddProductSelectCategoryContainer({
  categories,
  colors,
}: AddProductSelectCategoryContainerParams): React.ReactElement {
  const parentClassname = `w-full font-medium`;
  const headerClassname = `mb-2 font-semibold`;
  const categoryClassname = `grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto`;
  const colorClassname = `w-full flex flex-col flex-wrap gap-4 mt-5`;
  const boldTextClassname = `font-bold`;
  const smallTextClassname = `text-small`;
  const paletteClassname = `grid grid-cols-2 gap-3`;

  return (
    <div className={parentClassname}>
      <div className={headerClassname}>Select a Category</div>
      <div className={categoryClassname}>{categories}</div>
      <div className={colorClassname}>
        <div>
          <div className={boldTextClassname}>
            Select the available product colors and upload their images.
          </div>
          <div className={smallTextClassname}>
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored.
          </div>
        </div>

        <div className={paletteClassname}>{colors}</div>
      </div>
    </div>
  );
}

export function AdminAddProductFormContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = `p-1`;

  return (
    <div className={parentClassname}>
      <Container>
        <FormWrap>{children}</FormWrap>
      </Container>
    </div>
  );
}
