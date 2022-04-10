import { UserInputError } from "apollo-server-express";
import { Category } from "../../models/category.js";
import slugify from "slugify";

export const categoryResolvers = {
  Query: {
    async getCategory(_, { id }) {
      const category = await Category.findOne({ _id: id });
      if (!category) {
        throw new Error("Neplatné id");
      }
      return category;
    },

    async getCategories(_, { limit = 10, skip = 0 }) {
      const page = skip <= 1 ? 0 : skip * limit - 10;
      const categories = await Category.find({ hidden: true })
        .skip(page)
        .limit(limit);
      if (!categories.length) {
        throw new Error("Nebyli nalezené kategorie");
      }
      return [...categories];
    },
  },
  Mutation: {
    async createCategory(_, { category }) {
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

    async editCategory(_, { category }) {
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
  },
};
