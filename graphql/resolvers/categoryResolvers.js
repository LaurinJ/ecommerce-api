import { ApolloError, UserInputError } from "apollo-server-express";
import slugify from "slugify";
import { Category } from "../../models/category.js";
import { isAdmin } from "../../helpers/user.js";

export const categoryResolvers = {
  Query: {
    async getCategory(_, { id }) {
      const category = await Category.findOne({ _id: id });
      if (!category) {
        throw new Error("Neplatné id");
      }
      return category;
    },

    async getCategories() {
      const categories = await Category.find({ hidden: true });
      if (!categories.length) throw new Error("Nebyli nalezené kategorie");
      return [...categories];
    },

    async getAllCategories(_, { limit = 10, skip = 1 }, { user }) {
      isAdmin(user);

      const page = (skip - 1) * limit;

      // get the number of categories
      const count = await Category.find({}).countDocuments();
      const pages = Math.ceil(count / limit);

      // get categories
      const categories = count
        ? await Category.find({}).skip(page).limit(limit)
        : [];
      return { categories: categories, pages: pages };
    },
  },
  Mutation: {
    async createCategory(_, { category }, { user }) {
      isAdmin(user);

      //check category data:
      if (!category.name || !category.name.length) {
        throw new UserInputError("Invalid argument value", {
          errors: { name: "Toto pole je povinné" },
        });
      }
      delete category._id;
      const slug = slugify(category.name);
      const newCategory = new Category({ ...category, slug: slug });

      const data = await newCategory.save();

      return data._doc;
    },

    async editCategory(_, { category }, { user }) {
      isAdmin(user);

      //check category data:
      if (!category.name || !category.name.length) {
        throw new UserInputError("Invalid argument value", {
          errors: { name: "Toto pole je povinné" },
        });
      }
      const slug = slugify(category.name);

      const _category = await Category.findOneAndUpdate(
        { _id: category._id },
        { ...category, slug: slug }
      );

      return _category._doc;
    },

    async deleteCategory(_, { id }, { user }) {
      isAdmin(user);

      // check category id:
      if (!id) throw new UserInputError("Neplatné id!");

      const _category = await Category.findByIdAndDelete(id);

      if (!_category) throw new ApolloError("Něco se pokazilo!");

      return _category._doc;
    },
  },
};
