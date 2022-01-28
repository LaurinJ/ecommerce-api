import escapeStringRegexp from "escape-string-regexp";

export const ordersFilter = (params) => {
  let filter = {};
  if (params.numberOrder) {
    filter["orderNumber"] = { $regex: escapeStringRegexp(params.numberOrder) };
  }
  return filter;
};
