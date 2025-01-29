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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; 
    const skip = (page - 1) * limit;
    const category = req.query.category ? req.query.category.trim() : "";

    let filter = {};
    if (category) {
      filter.productCategory = { $regex: new RegExp(category, "i") };
    }

    const products = await Product.find(filter).skip(skip).limit(limit);

    if (!products.length) {
      return res.status(200).json({ products: [] });
    }

    return res.status(200).json({ products });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

