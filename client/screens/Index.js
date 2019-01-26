import React from "react";
import Title from "../components/Title";

const ScreenIndex = props => {
  const { name } = props;

  return <Title>Hello {name}</Title>;
};

export default ScreenIndex;
