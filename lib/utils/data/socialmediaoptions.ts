import { MdFacebook } from "react-icons/md";
import {
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
} from "react-icons/ai";
import { LinkItem } from "@/lib/jespo/types";

export const socialMediaOptions: LinkItem[] = [
  {
    label: "Facebook",
    url: null,
    Icon: MdFacebook,
  },
  {
    label: "Twitter",
    url: null,
    Icon: AiFillTwitterCircle,
  },
  {
    label: "Instagram",
    url: null,
    Icon: AiFillInstagram,
  },
  {
    label: "Youtube",
    url: null,
    Icon: AiFillYoutube,
  },
];
