"use client";

import FooterList from "./footerlist";
import { productCategories } from "@/lib/utils/data/productcategories";
import FooterProductCategory from "@/components/layout/footer/footerproductcategory";
import { customerServiceLinks } from "@/lib/utils/data/footercustomerservicelinks";
import { FooterLink } from "@/components/layout/footer/footerlink";
import React from "react";
import AboutCompany from "./aboutcompany";
import SimpleContainer from "@/components/layout/base/simplecontainer";
import { socialMediaOptions } from "@/lib/utils/data/socialmediaoptions";

export function FooterCategoryList(): React.ReactElement {
  const header = "Categories";

  return (
    <FooterList header={header}>
      {productCategories.map((category) => (
        <FooterProductCategory
          key={category.label}
          title={category.title}
          label={category.label}
        />
      ))}
    </FooterList>
  );
}

export function FooterCustomerServiceList(): React.ReactElement {
  const header = "Customer Service";
  const classname = "hover:text-white transition";

  return (
    <FooterList header={header}>
      {customerServiceLinks.map((link) => (
        <FooterLink
          key={link.label}
          url={link.url}
          label={link.label}
          classname={classname}
          Icon={null}
        />
      ))}
    </FooterList>
  );
}

export function AboutCompanySection(): React.ReactElement {
  const header = "About Us";
  const body = `
        At our electronics store, we are dedicated to providing the latest
              and greatest phones and phone accessories to our customers. With a wide
              selection of smartphones and premium phone accessories.
    `;
  const copyright = `\u00A9 2024 Jespo Gadgets. All rights reserved.`;

  return <AboutCompany header={header} body={body} copyright={copyright} />;
}

export function SocialMediaList(): React.ReactElement {
  const header = "Follow Us";
  const listClassname = "flex gap-3";
  const itemClassname =
    "text-[1.6rem] hover:text-white hover:scale-[1.2] active:scale-95 transition";

  return (
    <FooterList header={header}>
      <SimpleContainer classname={listClassname}>
        {socialMediaOptions.map((socialMediaOption) => (
          <FooterLink
            key={socialMediaOption.label}
            url={socialMediaOption.url}
            label={socialMediaOption.label}
            classname={itemClassname}
            Icon={socialMediaOption.Icon}
          />
        ))}
      </SimpleContainer>
    </FooterList>
  );
}
