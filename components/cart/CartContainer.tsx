import Container from "@/components/layout/base/container";
import { ContainerParams } from "@/lib/jespo/contracts";

export default function CartContainer({ children }: ContainerParams) {
  const parentClassname = `pt-8 px-0 sm:px-4 xl:px-0`;

  return (
    <div className={parentClassname}>
      <Container>{children}</Container>
    </div>
  );
}
