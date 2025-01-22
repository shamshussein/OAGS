import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Bundles() {
    const [bundles, setBundles] = useState([]);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/bundles/'); 
                setBundles(response.data);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchBundles();
    }, []);

    return (
        <section className="our-offers me-auto border-bottom border-black">
            <h2 style={{ paddingTop: '10vh', paddingBottom: '5vh', fontSize: '1.5rem' }}>BUNDLES</h2>
            <div className="our-products col-12 container d-flex flex-wrap justify-content-lg-between justify-content-md-center justify-content-center mx-auto">
                {bundles.map((bundle, index) => (
                    <div key={index} className="card shadow rounded bundle-card" style={{ width: "18rem" }}>
                        <div className="card-body">
                            <img src={bundle.image} className="img-thumbnail" style={{ border: "none" }} alt={bundle.name} />
                            <div className="fs-4 fw-bold mb-2" style={{ minHeight: "50px" }}>{bundle.name}</div>
                            <s className="text-secondary">Total Price: ${bundle.originalPrice}</s>
                            <div className="text-success fw-bold">Discounted Price: ${bundle.discountedPrice}</div>
                            <div className="btn border border-black BrowseCollectionBtn mt-2">Add to cart</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Bundles;
