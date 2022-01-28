import { UserInputError } from "apollo-server-express";
import { Address } from "../../models/address.js";
import { Person } from "../../models/person.js";
import { PersonDetail } from "../../models/personDetail.js";
import { Order } from "../../models/order.js";
import { personValidator } from "../../validators/person.js";
import { addressValidator } from "../../validators/address.js";
import { ordersFilter } from "../../helpers/ordersFilter.js";

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
      return { order: _order, person: _person };
    },
    async getOrders(_, { limit = 12, skip = 1, params }) {
      const page = (skip - 1) * limit;
      if (params && Object.keys(params).length !== 0) {
        const _params = ordersFilter(params);
        const count = await Order.find(_params).countDocuments();
        const pages = Math.ceil(count / 10);

        const orders = count
          ? await Order.find(_params)
              .populate("payment_method")
              .populate("deliver_method")
              .populate("person")
              .skip(page)
              .limit(limit)
          : [];
        return { orders: orders, pages: pages };
        // return orders;
      }
      // const orders = await Product.find({}).skip(page).limit(limit);
      return { orders: [], pages: 0 };
    },
  },
  Mutation: {
    async createOrUpdateOrder(_, { person, address, token }) {
      //check person data:
      const personErrors = personValidator(person);
      //check address data:
      const addressErrors = addressValidator(address);
      let _order;
      if (
        Object.keys(personErrors).length !== 0 ||
        Object.keys(addressErrors).length !== 0
      ) {
        throw new UserInputError("Invalid argument value", {
          errors: { ...personErrors, ...addressErrors },
        });
      }
      if (token.token) {
        _order = await Order.findOne(token).populate(
          "person",
          " person_detail address"
        );
        if (_order) {
          let _person_detail = await PersonDetail.findOneAndUpdate(
            { _id: _order.person.person_detail },
            person
          );
          let _address = await Address.findOneAndUpdate(
            { _id: _order.person.address },
            address
          );
        }
      } else {
        let _person_detail = await new PersonDetail(person).save();
        let _address = await new Address(address).save();
        let _person = await new Person({
          person_detail: _person_detail._id,
          address: _address._id,
          delivery_adress: _address._id,
        }).save();
        _order = await new Order({ person: _person._id }).save();
      }

      return { token: _order.token };
    },
    async paymentDelivery(_, { payment, delivery, token }) {
      if (!payment._id || !delivery._id) {
        throw new UserInputError("Nebyl zadán způsob platby nebo dopravy");
      }
      let _order = await Order.findOne(token);
      _order.payment_method = payment._id;
      _order.deliver_method = delivery._id;
      let _up = await _order.save();
      return { status: 204 };
    },
    async finishOrder(_, { order, token }) {
      let _order;

      if (token.token) {
        _order = await Order.findOne(token);
        if (_order && order) {
          _order.orderNumber = Date.now();
          _order.total_price = order.total_price;
          _order.items = order.items;
          _order.state = "created";
          _order = await _order.save();
          return { status: 201, message: "Objednávka úspěšně dokončena" };
        }
      }
      return { status: 400, message: "Nepodařilo se najít objednávku" };
    },
  },
};
