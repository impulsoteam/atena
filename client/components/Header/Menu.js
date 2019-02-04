import React from "react";
import StyledMenu from "./Menu.style";

const links = [
  {
    class: "index",
    title: "como funciona",
    link: "javascript:;"
  },
  {
    class: "ranking",
    title: "ranking",
    link: "javascript:;"
  }
];

const renderLinks = () =>
  links.map((item, index) => (
    <li key={index}>
      <a className={item.class} href={item.link}>
        {item.title}
      </a>
    </li>
  ));

const Menu = () => <StyledMenu>{renderLinks()}</StyledMenu>;

export default Menu;
