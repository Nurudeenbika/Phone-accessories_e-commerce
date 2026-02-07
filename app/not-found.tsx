import { Suspense } from "react";
import { NotFound } from "@/components/layout/base/emptypage";

export default function NotFoundPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
        </Suspense>
    );
}
