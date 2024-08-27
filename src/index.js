import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import WalletContextProvider from "./WalletProvider";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
