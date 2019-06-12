import React from "react";
import StyledSocialLinks from "./SocialLinks.style";

const links = [
  {
    icon: "facebook-f",
    link: "https://www.facebook.com/universoimpulso"
  },
  {
    icon: "twitter",
    link: "https://twitter.com/universoimpulso"
  },
  {
    icon: "linkedin-in",
    link: "https://www.linkedin.com/company/universoimpulso/"
  },
  {
    icon: "github",
    link: "https://github.com/universoimpulso"
  },
  {
    icon: "rocketchat",
    link: "https://chat.impulso.network"
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
