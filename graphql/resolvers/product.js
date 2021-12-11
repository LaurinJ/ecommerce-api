// const { GraphQLUpload } = require("graphql-upload");
// const Product = require("../../models/product");
// const Category = require("../../models/category");
// const slugify = require("slugify");
// const {
//   multipleUpload,
//   downloadFile,
//   multiDownload,
//   uploadProcess,
// } = require("../../helpers/image");

// const { chillfeed } = require("../../chillfeed");

import { GraphQLUpload } from "graphql-upload";
import { Product } from "../../models/product.js";
import { Category } from "../../models/category.js";
import slugify from "slugify";
import {
  multipleUpload,
  downloadFile,
  multiDownload,
  uploadProcess,
} from "../../helpers/image.js";
import { chillfeed } from "../../chillfeed.js";

export const productResolvers = {
  Upload: GraphQLUpload,
  Query: {
    // only test
    async testmultisave(_) {
      // products = [];
      const products = await Promise.all(
        chillfeed.SHOP.SHOPITEM.map(async (product) => {
          imgUrl = await downloadFile(product.IMGURL[0], "images");

          imgUrls = await multiDownload(product.IMAGES[0].IMGURL, "images");

          item = {
            title: product.PRODUCT_NAME[0],
            slug: slugify(product.PRODUCT_NAME[0]),
            description: product.DESCRIPTION_HTML[0],
            short_description: product.DESCRIPTION[0],
            imgurl: imgUrl,
            images: imgUrls,
            code: product.CODE[0],
            rating_sum: Math.floor(Math.random() * 1000),
            rating: Math.ceil(Math.random() * 5),
            price: Math.round(Number(product.PRICE[0])),
            old_price: Math.round(Number(product.MINIMAL_PRICE_VAT[0])),
            countInStock: Number(product.VAT[0]),
            categories: ["slevy"],
          };
          return item;
        })
      );
      Product.collection.insert(products, function (err, docs) {
        if (err) {
          return console.error(err);
        } else {
          console.log("Multiple documents inserted to Collection");
        }
      });

      const product = await Product.findOne({ price: 157 }).populate(
        "categories"
      );
      if (product.length === 0) {
        throw new Error("Nebyli nalezené žádné produkty");
      }
      return product;
    },

    async getProducts(_, { limit = 12, skip = 0 }) {
      const page = skip <= 1 ? 0 : skip * limit - 12;
      const products = await Product.find({})
        // .populate("categories")
        .skip(page)
        .limit(limit);
      if (products.length === 0) {
        throw new Error("Nebyli nalezené žádné produkty");
      }
      return [...products];
      // return {
      //   product: products.map((p) => {
      //     return {
      //       ...p._doc,
      //       createdAt: p.createdAt.toISOString(),
      //       updatedAt: p.updatedAt.toISOString(),
      //     };
      //   }),
      // };
    },
    async getProduct(_, { slug }) {
      const product = await Product.findOne({ slug: slug }).populate(
        // "categories",
        "-__v -_id"
      );
      if (!product) {
        throw new Error("Produkt nebyl nalezen");
      }
      return product;
    },
    async getCountPages() {
      const count = await Product.estimatedDocumentCount();
      const pages = Math.round(count / 12);
      return { pages: pages };
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
