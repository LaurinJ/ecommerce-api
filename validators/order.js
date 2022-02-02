export function orderValidator(order) {
  const errors = {};
  if (!order.payment) {
    errors.payment = "Způsob pladby je povinný";
  }
  if (!order.delivery) {
    errors.delivery = "Způsob dopravy je povinný";
  }
  if (!order.items || order.items.lenght === 0) {
    errors.delivery = "Nebyl přidán žádný produkt";
  }
  return errors;
}
