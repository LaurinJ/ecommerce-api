export function contactMessageValidator(message) {
  const errors = {};
  if (!message.email) {
    errors.email = "Toto pole je povinné";
  }
  if (!message.content) {
    errors.content = "Toto pole je povinné";
  }
  return errors;
}
