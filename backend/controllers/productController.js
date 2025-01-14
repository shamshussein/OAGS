const Product = require("../models/productModel");
const User = require("../models/userModel");

const checkAdmin = async(req) => {
    try {
        const user = await User.findOne({_id: req.user._id});
        if(!user || user.role !=="admin"){
            return false;
        }
        else{
            return true;
        }
    } catch (err) {
        console.log(err);
    }
};

exports.createProduct = async (req,res) =>{
    try {
        // const user = await checkAdmin(req);
        // if(user === false){
        //     res.status(404).json({message: "A product should be added by admin!"});
        // }
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

exports.updateProduct = async(req,res)=>{
    try {
        const user = await checkAdmin(req);
        if(user === false){
            return res.status(401).json({message: "only admin can update the product"});
        }
        const product = await Product.findByIdAndUpdate(
            req.params.productID,
             req.body,
            { new: true }
            );
            if(!product){
                return res.status(404).json({message: "Product Not found"});
            }
            return res.status(200).json({message: "product updated successfully"});
        } catch (err) {
        res.status(500).json({message: err});
    }
};
exports.deleteProduct = async(req,res)=>{
    try {
        const user = await checkAdmin(req);
        if(user === false){
            return res.status(401).json({message: "only admin can delete the product"});
        }
        const product = await Product.findByIdAndDelete(
            req.params.productID,
            );
            if(!product){
                return res.status(404).json({message: "Product Not found"});
            }
            return res.status(200).json({message: "product deleted successfully"});
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

  