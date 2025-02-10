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

    const search = req.query.search ? req.query.search.trim() : "";
    const filterCategory = req.query.filterCategory
      ? req.query.filterCategory.trim()
      : "";
    const priceRange = req.query.priceRange ? req.query.priceRange.trim() : "";

    let filter = {};

    if (filterCategory) {
      filter.productCategory = { $regex: new RegExp(`^${filterCategory}$`, "i") };
    }

    if (search) {
      filter.$or = [
        { productName: { $regex: new RegExp(search, "i") } },
        { productDescription: { $regex: new RegExp(search, "i") } },
        { productCategory: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      const discountFactor = 0.9; 
      filter.productPrice = { $gte: min / discountFactor, $lte: max / discountFactor };
    }

    const products = await Product.find(filter).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(filter);
    const hasMore = skip + products.length < totalProducts;

    return res.status(200).json({ products, hasMore, totalProducts });
  } catch (err) {
    console.error("Error in getAllProducts:", err);
    return res.status(500).json({ message: "Server error" });
  }
};