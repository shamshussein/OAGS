import React from 'react'
import bundelData from './bundelsdata.json'


function Bundels() {
  return (
    <section className="our-offers me-auto border-bottom border-black">
    <h2 style={{paddingTop: '10vh', paddingBottom: '5vh', fontSize: '1.5rem'}}>BUNDLES</h2>
    <div className="our-products col-12 container d-flex flex-wrap justify-content-lg-between justify-content-md-center justify-content-center mx-auto">

    {bundelData.map((bundel,index) => (

        <div key={index} className='card shadow rounded bundel-card' style={{width: "18rem"}}>
            <div className='card-body'>
                <img src={bundel.image} className='img-thumbnail' style={{border: "none"}} />
                <div className='fs-4 fw-bold mb-2' style={{minHeight:"50px"}}>{bundel.name}</div>
                <s className='text-secondary'>Total Price: ${bundel.Price}</s>
                <div className='text-success fw-bold'>Discounted Price: ${bundel.discountedPrice}</div>
                <div className='btn border border-black BrowseCollectionBtn mt-2'>Add to cart</div>
            </div>
        </div>

    ))}


    </div>
    </section>
  )
}

export default Bundels