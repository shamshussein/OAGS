import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast,faCircleCheck,faLock} from '@fortawesome/free-solid-svg-icons';
function Cares() {
  return (
    <section className="why-shop-with-us border-bottom border-black">
      <h2 className="text-center" style={{ paddingTop: '10vh', paddingBottom: '5vh', fontSize: '1.5rem' }}>
        WHAT WE CARE ABOUT
      </h2>
      <div className="container">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="benefit-item">
              <FontAwesomeIcon icon={faTruckFast} className="fa-2x" style={{ color: '#679289', paddingBottom: '2vh' }} />
              <h3>Fast Shipping</h3>
              <p>Fast shipping on all orders, no matter the size or location.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="benefit-item">
              <FontAwesomeIcon icon={faCircleCheck} className="fa-2x" style={{ color: '#679289', paddingBottom: '2vh' }} />
              <h3>Quality Products</h3>
              <p>We offer only the highest quality products, carefully selected to meet your needs.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="benefit-item">
              <FontAwesomeIcon icon={faLock} className="fa-2x" style={{ color: '#679289', paddingBottom: '2vh' }} />
              <h3>Secure Payments</h3>
              <p>We use the latest security protocols to ensure your payment information is safe.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cares;
