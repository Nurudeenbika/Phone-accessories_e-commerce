import React, { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/serverAuth";
import { AdminAddProductFormContainer } from "@/components/layout/admin/AdminContainer";
import AddProductForm from "@/app/admin/form/AddProductForm";
import { AdminSkeleton } from "@/components/ui/skeleton";

export default async function AddProducts(): Promise<React.ReactElement> {
  // Require admin authentication
  await requireAdmin();

  return (
    <div>
      <Suspense fallback={<AdminSkeleton variant="form" count={8} />}>
        <AdminAddProductFormContainer>
          <AddProductForm />
        </AdminAddProductFormContainer>
      </Suspense>
    </div>
  );
}
