const Product = require("../../models/product");

module.exports = {
  Query: {
    async getProducts() {
      const products = await Product.find({});
      if (!products) throw new Error("Nebyli nalezené žádné produkty");
      return {
        product: products.map((p) => {
          console.log(p._doc);
          return {
            ...p._doc,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          };
        }),
      };
    },
  },
};
