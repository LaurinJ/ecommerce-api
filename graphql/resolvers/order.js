const {
  ApolloError,
  UserInputError,
  ValidationError,
} = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Address = require("../../models/address");
const Person = require("../../models/person");
const PersonDetail = require("../../models/personDetail");
const { personValidator } = require("../../validators/person");
const { addressValidator } = require("../../validators/address");

module.exports = {
  Query: {},
  Mutation: {
    async personAdress(_, { person, address }) {
      //check person data:
      const personErrors = personValidator(person);
      //check address data:
      const addressErrors = addressValidator(address);

      if (
        Object.keys(personErrors).length !== 0 ||
        Object.keys(addressErrors).length !== 0
      ) {
        console.log("err");
        throw new UserInputError("Invalid argument value", {
          errors: { ...personErrors, ...addressErrors },
        });
      }

      let _person_detail = await new PersonDetail(person).save();
      let _address = await new Address(address).save();
      let _person = await new Person({
        person_detail: _person_detail.id,
        address: _address.id,
        delivery_adress: _address.id,
      }).save();

      return { token: _person.token };
    },
  },
};
