import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import UserProfile from "./components/UserProfile.jsx";
import RecipePage from './pages/RecipePage.jsx';
import CuisinePage from './pages/CuisinePage.jsx';
import Footer from './components/Footer.jsx';
import ContactPage from './pages/ContactPage.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/cuisine/:id" element={<CuisinePage />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
