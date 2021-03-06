const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
// this is means file system and for mainly used to access the path of the folders and
// its internal library so we need not to install it from npm
const fs = require("fs");
const { fromPairs, parseInt, sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, Product) => {
      if (err || !Product) {
        console.log("error inside product");
        return res.status(400).json({
          error: `Produst by is not available `,
        });
      }
      // console.log(Product);
      req.product = Product;
      next();
    });
};

exports.getProduct = (req, res) => {
  const product = req.product;
  product.photo = undefined;
  return res.json(product);
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  // it will keep our extensions like mp4 png jpeg etc
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.json(400).json({
        error: "Problem with image size of extension",
      });
    }

    // Destructure the fiels
    const { name, description, price, category, stock } = fields;

    // here we are restricting values should needed
    // we can provide directly this restrictions on route (express-validation)
    //  and that's better than this

    if (!name || !description || !category || !price || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    // checking that file.photo is uploaded or not

    if (file.photo == undefined) {
      return res.status(400).json({
        error: "Please Upload Photo",
      });
    }
    // Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentTyoe = file.photo.type;
    }
    console.log(product);
    // Save product to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving tshirt in DB is failed",
        });
      }
      res.json(product);
    });
  });
};
// Middlewares

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// Delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product",
      });
    }
    res.json({
      message: `Deletion was a success ${deletedProduct.name}`,
    });
  });
};

// update controllers
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  // it will keep our extensions like mp4 png jpeg etc
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.json(400).json({
        error: "Problem with image size of extension",
      });
    }

    // updation of code
    let product = req.product;
    product = _.extend(product, fields);

    // checking that file.photo is uploaded or not

    if (file.photo == undefined) {
      return res.status(400).json({
        error: "Please Upload Photo",
      });
    }
    // Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentTyoe = file.photo.type;
    }
    console.log(product);
    // Save product to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed",
        });
      }
      res.json(product);
    });
  });
};

// Product list
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product found from DB",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  console.log("Update stoke here ");
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
