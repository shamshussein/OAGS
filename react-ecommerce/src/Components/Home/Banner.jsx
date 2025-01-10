import React from 'react'
import bannerData from './bannerdata.json'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade'; // Import fade effect styles

import { Autoplay,Pagination,EffectFade  } from 'swiper/modules';

function Banner() {
    return (
      <Swiper
      spaceBetween={50}
      slidesPerView={1}
       autoplay={{
         delay: 1500,
         disableOnInteraction: false,
       }}
       effect={'fade'} // Apply the fade effect
       speed={400} // Transition duration in milliseconds
      fadeEffect={{ crossFade: true }} // Optional: Smooth cross-fade
      pagination={{ clickable: true }}
      loop
      navigation={false}
      modules={[Autoplay, Pagination,EffectFade]}
      className='border-bottom border-black'
      >
        {bannerData.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className='bannerMother'>
            <div className="banner-item d-flex align-items-center banner-image" style={{ backgroundImage: `url(${banner.image})` }}>
              <div className="content d-flex flex-column align-items-start ms-lg-5 gap-2">
                <span className="tag">{banner.tag}</span><br />
                <h2 className="discount-title">{banner.title}</h2><br />
                <p className="discount-date">{banner.date}</p><br />
                <button
                  className="btn border border-black BrowseCollectionBtn"
                  onClick={() => window.location.href = banner.link}
                >
                  Browse Collection
                </button>
              </div>
            
            </div>
            </div>
          
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

export default Banner   