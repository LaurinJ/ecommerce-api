export function addressValidator(address) {
  const errors = {};
  for (let [key, value] of Object.entries(address)) {
    if (!value) {
      errors[key] = "Toto pole je povinné";
    }
  }
  return errors;
}
