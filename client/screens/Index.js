import React from "react";
import PropTypes from "prop-types";
import Layout from "../Layout";
import Title from "../components/Title";

const ScreenIndex = props => {
  const { name } = props;

  return (
    <Layout>
      <Title>Hello {name}</Title>
    </Layout>
  );
};
ScreenIndex.propTypes = {
  name: PropTypes.string
};

ScreenIndex.defaultProps = {
  name: "Atena"
};

export default ScreenIndex;
