import React, { Fragment } from "react";
import PropTypes from "prop-types";
import StyledMenu from "./Menu.style";

const links = user => {
  const whithoutAuth = [
    {
      class: "login",
      title: "login",
      link: "/auth/linkedin"
    }
  ];
  const withAuth = [
    {
      class: "logout",
      title: "Sair",
      link: "/auth/logout"
    }
  ];

  const options = user ? withAuth : whithoutAuth;

  return [
    {
      class: "index",
      title: "como funciona",
      link: "/"
    },
    {
      class: "ranking",
      title: "ranking",
      link: "/ranking"
    },
    ...options
  ];
};

const ProfileUser = ({ avatar }) => (
  <a className="profile" href="javascript;">
    <img src={avatar} className="avatar" />
  </a>
);

ProfileUser.propTypes = {
  avatar: PropTypes.string.isRequired
};

const renderLinks = ({ user }) => (
  <Fragment>
    {links(user).map((item, index) => (
      <li key={index}>
        <a className={item.class} href={item.link}>
          {item.title}
        </a>
      </li>
    ))}
    {user && (
      <li className="user">
        <ProfileUser avatar={user.avatar} />
      </li>
    )}
  </Fragment>
);

renderLinks.propTypes = {
  user: PropTypes.object
};

const Menu = props => <StyledMenu>{renderLinks(props)}</StyledMenu>;

export default Menu;
