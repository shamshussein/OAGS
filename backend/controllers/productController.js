const Product = require("../models/productModel");

exports.createProduct = async (req,res) =>{
    try {
        const newProduct = await Product.create({
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productPrice: req.body.productPrice,
            productQuantity: req.body.productQuantity,
            productCategory: req.body.productCategory,
            productRating: req.body.productRating,     
            isSized: req.body.isSized, 
        });
        return res.status(201).json({message: "Product has been added successfully!", product: newProduct});

    } catch (err) {
        res.status(500).json({message: err});
        
    }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); 
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    return res.status(200).json({ products }); 
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: 'Server error' });
  }
};

  