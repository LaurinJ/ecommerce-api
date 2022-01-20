export function productValidator(product) {
  const errors = {};
  if (!product.title) {
    errors.title = "Toto pole je povinné";
  }
  if (!product.price) {
    errors.price = "Toto pole je povinné";
  }
  if (!product.short_description) {
    errors.short_description = "Toto pole je povinné";
  }
  if (!product.description) {
    errors.description = "Toto pole je povinné";
  }
  if (!product.code) {
    errors.code = "Toto pole je povinné";
  }
  if (!product.countInStock) {
    errors.countInStock = "Toto pole je povinné";
  }
  if (!product.categories) {
    errors.categories = "Toto pole je povinné";
  }
  return errors;
}
