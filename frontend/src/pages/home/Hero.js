import React from 'react';
import 'styles/Hero.css';
import Banner from 'components/home/Banner';
import Cares from 'components/home/Cares';
import Bundels from 'components/home/Bundels';
import FeedBack from 'components/home/FeedBack';

function Hero() {
  return (
    <div>
      <Banner />
      <Cares />
      <Bundels />
      <FeedBack />
    </div>
  );
}

export default Hero;
