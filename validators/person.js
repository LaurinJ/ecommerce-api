export function personValidator(person) {
  const errors = {};
  const regexName = /^[a-zA-Z]+$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!person.email) {
    errors.email = "Toto pole je povinné";
  } else if (!regexEmail.test(person.email)) {
    errors.email = "Email je ve špatném formátu";
  }
  if (!person.first_name) {
    errors.first_name = "Toto pole je povinné";
  } else if (!regexName.test(person.first_name)) {
    errors.first_name = "Jméno je ve špatném formátu";
  }
  if (!person.last_name) {
    errors.last_name = "Toto pole je povinné";
  } else if (!regexName.test(person.last_name)) {
    errors.last_name = "Příjmení je ve špatném formátu";
  }
  if (!person.phone) {
    errors.first_name = "Toto pole je povinné";
  }
  return errors;
}
