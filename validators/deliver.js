export function deliverValidator(deliver) {
  const errors = {};
  if (!deliver.name) {
    errors.name = "Toto pole je povinné";
  }
  if (!deliver.price) {
    errors.price = "Toto pole je povinné";
  }
  return errors;
}
