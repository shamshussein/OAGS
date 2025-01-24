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
        <section className="our-offers me-auto border-black">
            <h2 style={{ paddingTop: '10vh', paddingBottom: '5vh', fontSize: '1.5rem' }}>BUNDLES</h2>
            <div className="our-products col-12 container d-flex flex-wrap justify-content-lg-between justify-content-md-center justify-content-center mx-auto">
                {bundles.map((bundle, index) => (
                    <div key={index} className="card shadow rounded bundle-card" style={{ width: "18rem" }}>
                        <div className="card-body">
                            <img src={bundle.image} className="img-thumbnail" style={{ border: "none" }} alt={bundle.name} />
                            <div className="fs-4 fw-bold mb-2" style={{ minHeight: "50px" }}>{bundle.name}</div>
                            <s className="text-secondary">Total Price: ${parseFloat(bundle.originalPrice).toFixed(2)}</s>
                            <div className="text-success fw-bold">Discounted Price: ${parseFloat(bundle.discountedPrice).toFixed(2)}</div>
                            <ul className="list-group mt-3">
                                {bundle.products.map((product, idx) => (
                                    <li key={idx} className="list-group-item">
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="btn border border-black BrowseCollectionBtn mt-2"
                                onClick={() => addBundleToCart(bundle._id)} 
                            >
                                Add Bundle to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Bundles;
