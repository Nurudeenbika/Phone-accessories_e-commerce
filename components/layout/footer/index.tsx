"use client";

import FooterContainer from "@/components/layout/footer/footercontainer";
import {
  FooterCategoryList,
  FooterCustomerServiceList,
  AboutCompanySection,
  SocialMediaList,
} from "@/components/layout/footer/listitems";

export default function Footer() {
  return (
    <FooterContainer>
      <FooterCategoryList />
      <FooterCustomerServiceList />
      <AboutCompanySection />
      <SocialMediaList />
    </FooterContainer>
  );
}
