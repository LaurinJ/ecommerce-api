// const { UserInputError } = require("apollo-server-express");
// const Address = require("../../models/address");
// const Person = require("../../models/person");
// const PersonDetail = require("../../models/personDetail");
// const { personValidator } = require("../../validators/person");
// const { addressValidator } = require("../../validators/address");

import { UserInputError } from "apollo-server-express";
import { Address } from "../../models/address.js";
import { Person } from "../../models/person.js";
import { PersonDetail } from "../../models/personDetail.js";
import { personValidator } from "../../validators/person.js";
import { addressValidator } from "../../validators/address.js";

export const orderResolvers = {
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
