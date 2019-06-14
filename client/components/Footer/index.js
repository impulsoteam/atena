import React from "react";
import { StyledFooter, StyledCopyright } from "./style";
import SocialLinks from "./SocialLinks";

const Footer = () => (
  <StyledFooter>
    <section>
      <img className="impulsoIcon" src="/images/impulso.svg" />
      <SocialLinks />
      <hr />
      <StyledCopyright>
        2019 © Todos os direitos reservados. Impulso.
      </StyledCopyright>
    </section>
  </StyledFooter>
);

export default Footer;
