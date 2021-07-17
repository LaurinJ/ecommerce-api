const Product = require("../../models/product");
const slugify = require("slugify");

module.exports = {
  Query: {
    async getProducts() {
      const products = await Product.find({});
      if (products.length === 0) {
        throw new Error("Nebyli nalezené žádné produkty");
      }
      return {
        product: products.map((p) => {
          return {
            ...p._doc,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          };
        }),
      };
    },
  },
  Mutation: {
    async createProduct(_, { product }, context) {
      if (product.description.trim() === "") {
        throw new Error("Chybí popis produktu");
      }
      const newProduct = new Product({
        ...product,
        slug: slugify(product.title),
      });

      const data = await newProduct.save();

      // if (data) {
      console.log(data);
      // }

      return data;
    },
  },
};
