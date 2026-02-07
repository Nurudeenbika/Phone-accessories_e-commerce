import React from "react";
import { AdminAddProductFormContainer } from "@/components/layout/admin/AdminContainer";
import EditProductForm from "@/app/admin/form/EditProductForm";
import { getProductById } from "@/lib/jespo/queries/product";
import EmptyPage from "@/components/layout/base/emptypage";

export default async function EditProducts({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<React.ReactElement> {
  const { productId } = await params;
  const product = await getProductById({ productId });

  if (product === null) {
    return <EmptyPage title={"No products found"} />;
  }

  return (
    <AdminAddProductFormContainer>
      <EditProductForm product={product} />
    </AdminAddProductFormContainer>
  );
}
