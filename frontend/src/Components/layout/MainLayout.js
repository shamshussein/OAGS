import React from 'react';
import Header from 'Components/Layout/NavBar/Header';
import Footer from 'Components/Layout/Footer/Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
