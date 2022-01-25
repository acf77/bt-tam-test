import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Checkout from "./screens/Checkout";
import Success from "./screens/Success";
import Header from "../src/components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
