import React from "react";
import StyledMenu from "./Menu.style";

const links = [
  {
    title: "como funciona",
    link: "javascript:;"
  },
  {
    title: "ranking",
    link: "javascript:;"
  }
];

const renderLinks = () =>
  links.map((item, index) => (
    <li key={index}>
      <a href={item.link}>{item.title}</a>
    </li>
  ));

const Menu = () => <StyledMenu>{renderLinks()}</StyledMenu>;

export default Menu;
