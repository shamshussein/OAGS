import React from 'react';
import 'styles/hero.css';
import Banner from 'Components/Home/Banner';
import Cares from 'Components/Home/Cares';
import Bundels from 'Components/Home/Bundels';
import FeedBack from 'Components/Home/FeedBack';

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
