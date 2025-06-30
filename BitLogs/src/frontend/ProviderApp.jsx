import React from "react";
import App from "./App";
import { SearchProvider } from "./context/SearchContext";
const ProviderApp = () => (
  <SearchProvider>
    <App />
  </SearchProvider>
);

export default ProviderApp;