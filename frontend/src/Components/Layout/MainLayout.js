import React from 'react';
import Header from 'Components/layout/NavBar/Header';
import Footer from 'Components/layout/Footer/Footer';

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
