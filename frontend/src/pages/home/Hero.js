
import React from 'react';
import 'styles/hero.css';
import Banner from 'Components/home/Banner';
import Cares from 'Components/home/Cares';
import Bundels from 'Components/home/Bundels';
import FeedBack from 'Components/home/FeedBack';

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
