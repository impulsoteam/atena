import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const initialData = JSON.parse(
  document.getElementById("initial-data").getAttribute("data-json")
);

ReactDOM.hydrate(<App {...initialData} />, document.getElementById("app"));
