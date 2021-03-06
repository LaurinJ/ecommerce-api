import { GraphQLUpload } from "graphql-upload";
import { UserInputError } from "apollo-server-express";
import escapeStringRegexp from "escape-string-regexp";
import { Product } from "../../models/product.js";
import { Category } from "../../models/category.js";
import { Review } from "../../models/review.js";
import slugify from "slugify";
import {
  multipleUpload,
  downloadFile,
  multiDownload,
} from "../../helpers/image.js";
import { chillfeed } from "../../chillfeed.js";
import { productValidator } from "../../validators/product.js";
import { productsFilter } from "../../helpers/productsFilter.js";
import { isAdmin } from "../../helpers/user.js";

export const productResolvers = {
  Upload: GraphQLUpload,
  Query: {
    // only test or mock
    async mockData(_) {
      let _category = ["Extra pálivé", "Mírně pálivé", "Středně pálivé"];
      _category = _category.map((cat) => {
        const slug = slugify(cat);
        return new Category({ name: cat, slug: slug, hidden: true });
      });

      const categories = await Category.insertMany(_category);

      const products = await Promise.all(
        chillfeed.SHOP.SHOPITEM.map(async (product) => {
          let imgUrl = await downloadFile(product.IMGURL[0], "images");

          let imgUrls = await multiDownload(product.IMAGES[0].IMGURL, "images");

          let item = {
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
            hidden: true,
            categories:
              categories[Math.floor(Math.random() * categories.length)]._id,
          };
          return item;
        })
      );
      Product.insertMany(products, function (err, docs) {
        if (err) {
          return console.error(err);
        } else {
          console.log("Multiple documents inserted to Collection");
        }
      });

      const product = await Product.findOne({ price: 157 }).populate(
        "categories"
      );
      if (!product) {
        throw new Error("Nebyli nalezené žádné produkty");
      }
      return product;
    },

    async getProducts(_, { limit = 12, skip = 0, query }) {
      const page = skip <= 1 ? 0 : skip * limit - 12;
      let products;
      if (query) {
        const regex = escapeStringRegexp(query);
        products = await Product.find({ title: { $regex: regex } })
          // .populate("categories")
          .skip(page)
          .limit(limit);
      } else {
        products = await Product.find({})
          // .populate("categories")
          .skip(page)
          .limit(limit);
      }
      if (products.length === 0) {
        throw new Error("Nebyli nalezené žádné produkty");
      }
      return [...products];
    },

    async getProduct(_, { slug }) {
      const product = await Product.findOne({ slug: slug });
      // .populate(
      //   "categories",
      //   "-__v"
      // );
      if (!product) throw new Error("Produkt nebyl nalezen");

      return product;
    },

    async getCountProducts(_, __, { user }) {
      isAdmin(user);
      const count = await Product.find({}).countDocuments();
      return { count: count };
    },

    async getProductsByCategory(_, { limit = 12, skip = 1, params }) {
      const page = (skip - 1) * limit;
      // check params
      if (params && Object.keys(params).length !== 0) {
        // create a search query
        let _params = productsFilter(params);
        const category = await Category.findOne({ slug: _params.categories });
        // check category
        if (category) {
          _params.categories = category._id;
          // get the number of products
          const count = await Product.find(_params).countDocuments();
          const pages = Math.ceil(count / limit);

          // get products
          const products = count
            ? await Product.find(_params)
                .sort(params.sort)
                .skip(page)
                .limit(limit)
            : [];
          return { products: products, pages: pages };
        }
      }
      return { products: [], pages: 0 };
    },

    async getFilterProducts(_, { limit = 12, skip = 1, params }) {
      const page = (skip - 1) * limit;
      if (params && Object.keys(params).length !== 0) {
        const _params = productsFilter(params);
        const count = await Product.find(_params).countDocuments();
        const pages = Math.ceil(count / limit);

        const products = count
          ? await Product.find(_params).skip(page).limit(limit)
          : [];
        return { products: products, pages: pages };
      }
      return { products: [], pages: 0 };
    },
  },
  Mutation: {
    async createProduct(_, { product, images }, { user }) {
      isAdmin(user);

      //check product data:
      const productErrors = productValidator(product);
      if (Object.keys(productErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: { ...productErrors },
        });
      }
      let imagesData = await multipleUpload(images);

      delete product._id;

      const cat = await Category.find({
        _id: { $in: product.categories },
      }).exec();
      const newProduct = new Product({
        ...product,
        imgurl: imagesData[0],
        images: imagesData,
        categories: cat,
        slug: slugify(product.title),
      });

      const data = await newProduct.save();

      return data._doc;
    },

    async editProduct(_, { product, images }, { user }) {
      isAdmin(user);

      //check product data:
      const productErrors = productValidator(product);
      if (Object.keys(productErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: { ...productErrors },
        });
      }

      // let imagesData = await multipleUpload(images);

      const cat = await Category.find({
        _id: { $in: product.categories },
      }).exec();
      const newProduct = await Product.findByIdAndUpdate(
        { _id: product._id },
        {
          ...product,
          categories: cat,
          slug: slugify(product.title),
        }
      );

      return newProduct;
    },

    async deleteProduct(_, { id }, { user }) {
      isAdmin(user);

      // check product id:
      if (!id) throw new UserInputError("Neplatné id!");

      const _product = await Product.findByIdAndDelete(id);

      if (!_product) throw new ApolloError("Něco se pokazilo!");

      // hidden product reviews
      await Review.updateMany({ product: _product._id }, { hidden: false });

      return _product._doc;
    },
  },
};
