import { UserInputError } from "apollo-server-express";
import { Address } from "../../models/address.js";
import { Person } from "../../models/person.js";
import { PersonDetail } from "../../models/personDetail.js";
import { Order } from "../../models/order.js";
import { personValidator } from "../../validators/person.js";
import { addressValidator } from "../../validators/address.js";

export const orderResolvers = {
  Query: {
    async getOrder(_, { token }) {
      let _order = await Order.findOne({ token: token.token })
        .populate("payment_method")
        .populate("deliver_method")
        .exec();
      let _person = await Person.findById(
        _order.person,
        "address person_detail"
      )
        .populate("person_detail")
        .populate("address");
      // console.log(_order);
      // console.log(_person);
      // let a = (_order, { person: _person });
      // console.log(_person);
      return { order: _order, person: _person };
    },
  },
  Mutation: {
    async createOrder(_, { person, address, order }) {
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
      let _order = await new Order({ person: _person._id, ...order }).save();

      return { token: _order.token };
    },
    async paymentDelivery(_, { payment, delivery, token }) {
      if (!payment._id || !delivery._id) {
        throw new UserInputError("Nebyl zadán způsob platby nebo dopravy");
      }
      let _order = await Order.findOne(token);
      _order.payment_method = payment._id;
      _order.deliver_method = delivery._id;
      let up = await _order.save();
      if (_up) {
        return { status: "ok" };
      }
      throw new Error("Něco se pokazilo");
    },
  },
};
