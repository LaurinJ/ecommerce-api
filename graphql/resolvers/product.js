const { GraphQLUpload } = require("graphql-upload");
const Product = require("../../models/product");
const Category = require("../../models/category");
const slugify = require("slugify");
const { multipleUpload } = require("../../helpers/image");

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    async getProducts() {
      const products = await Product.find({}).populate("categories");
      if (products.length === 0) {
        throw new Error("Nebyli nalezené žádné produkty");
      }
      return {
        product: products.map((p) => {
          console.log(p);
          return {
            ...p._doc,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          };
        }),
      };
    },
    async getProduct(_, { slug }) {
      const product = await Product.findOne({ slug: slug.slug }).populate(
        "categories",
        "-__v -_id"
      );
      if (!product) {
        throw new Error("Produkt nebyl nalezen");
      }
      return product;
    },
  },
  Mutation: {
    async createProduct(_, { product, images }) {
      if (!product.title || !product.title.length) {
        throw new Error("Title je poviný");
      }

      if (!product.description || !product.description.length) {
        throw new Error("Chybí popis produktu");
      }

      if (!product.price) {
        throw new Error("Chybí cena produktu");
      }

      let imagesData = await multipleUpload(images);

      const cat = await Category.find({ name: product.categories }).exec();
      console.log(cat);

      const newProduct = new Product({
        ...product,
        images: imagesData,
        categories: cat,
        slug: slugify(product.title),
      });

      const data = await newProduct.save();

      return data._doc;
    },
  },
};
