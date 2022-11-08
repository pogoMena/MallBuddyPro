import * as ReactDOMClient from "react-dom/client";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";


const rootElement = document.getElementById("root");

const root = ReactDOMClient.createRoot(rootElement);
root.render(<App callback={() => console.log("renderered")} />);

