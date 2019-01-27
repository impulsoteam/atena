import React from "react";
import StyledSocialLinks from "./SocialLinks.style";

const links = [
  {
    icon: "facebook-f",
    link: "javascript:;"
  },
  {
    icon: "twitter",
    link: "javascript:;"
  },
  {
    icon: "linkedin-in",
    link: "javascript:;"
  },
  {
    icon: "instagram",
    link: "javascript:;"
  },
  {
    icon: "github",
    link: "javascript:;"
  },
  {
    icon: "rocketchat",
    link: "javascript:;"
  }
];

const renderLinks = () =>
  links.map((item, index) => (
    <li key={index}>
      <a
        href={item.link}
        className={`fab fa-${item.icon}`}
        target="_blank"
        rel="noopener noreferrer"
      />
    </li>
  ));

const SocialLinks = () => (
  <StyledSocialLinks>{renderLinks()}</StyledSocialLinks>
);

export default SocialLinks;
