import escapeStringRegexp from "escape-string-regexp";

export const productsFilter = (params) => {
  let filter = {};
  if (params.title) {
    filter["title"] = { $regex: escapeStringRegexp(params.title) };
  }
  if (params.category) {
    filter["categories"] = escapeStringRegexp(params.category);
  }
  if (params.min_price && typeof params.min_price === "number") {
    filter["price"] = { $gte: params.min_price };
  }
  if (params.max_price && typeof params.max_price === "number") {
    filter["price"] = { ...filter.price, $lte: params.max_price };
  }
  return filter;
};
