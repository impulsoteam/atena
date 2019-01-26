import React from "react";
import Layout from "../Layout";
import Title from "../components/Title";

const ScreenIndex = () => {
  return (
    <Layout>
      <Title>Index</Title>
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
