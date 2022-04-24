export function paymentValidator(payment) {
  const errors = {};
  if (!payment.name || !payment.name.length) {
    errors.name = "Toto pole je povinné";
  }
  return errors;
}
