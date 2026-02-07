import { AvatarParams } from "@/lib/jespo/contracts";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export default function Avatar({ src }: AvatarParams): React.ReactElement {
  const classname = "rounded-full border-[1px] border-primary-400";

  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className={classname}
        height={28}
        width={28}
      />
    );
  }

  return <FaUserCircle size={28} />;
}
