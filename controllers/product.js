const Product = require("../models/product");
const slugify = require("slugify");

exports.list = (req, res) => {
  Product.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.create = (req, res) => {
  const { title, description, code, price, category } = req.body;

  let product = new Product();
  product.title = title;
  product.slug = slugify(title).toLowerCase();
  product.description = description;
  product.code = code;
  product.price = price;
  product.categories = [category];

  product.save((err, data) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.json(data);
  });
};
