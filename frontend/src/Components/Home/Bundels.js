import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

function BundleBanner() {
  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/bundles/');
        setBundles(response.data);
      } catch (err) {
        console.error("Error fetching bundles:", err.message);
      }
    };

    fetchBundles();
  }, []);

  const addBundleToCart = async (bundleId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.token) {
        alert("User is not logged in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/carts/addBundleToCart",
        { bundleId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Server Response:", response.data);
      alert("Bundle added to cart successfully.");
    } catch (err) {
      console.error("Error adding bundle to cart:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{
        delay: 1500,
        disableOnInteraction: false,
      }}
      effect={'fade'}
      speed={400}
      fadeEffect={{ crossFade: true }}
      pagination={{ clickable: true }}
      loop
      navigation={false}
      modules={[Autoplay, Pagination, EffectFade]}
      className=''
    >
      {bundles.map((bundle, index) => (
        <SwiperSlide key={index}>
          <div className='bundleMother'>
            <div className="bundle-item d-flex align-items-center bundle-image"
             style={{ backgroundImage: `url(${bundle.imagebanner})`,
             backgroundSize: 'cover',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             width: '100%',
             height: '500px',
             }}>

              <div className="content d-flex flex-column align-items-start ms-lg-5 gap-2">
                
                <h2 className="bundle-title">{bundle.name}</h2><br />
               
                <s className="text-decoration-line-through " style={{color:'red', fontWeight:'bold'}}> Price: ${parseFloat(bundle.originalPrice).toFixed(2)}</s>
                <div className="text-success fw-bold">Discounted Price: ${parseFloat(bundle.discountedPrice).toFixed(2)}</div>
                <br/>
                <button
                  className="btn border border-black BrowseBundleBtn mt-2"
                  onClick={() => addBundleToCart(bundle._id)}
                >
                  Add Bundle to Cart
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default BundleBanner;
