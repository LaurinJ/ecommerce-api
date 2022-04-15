import axios from "axios";
import { Order } from "../../models/order.js";
import { Person } from "../../models/person.js";
import { paidOrderEmail } from "../../helpers/email.js";
import { createInvoice } from "../../helpers/invoice.js";

export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    //   send payment capture
    const data = await axios
      .post(
        `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_KEY,
            password: process.env.PAYPAL_SECRET_KEY,
          },
        }
      )
      .then((res) => res.data);

    // token check and order status check
    const orderToken = data.purchase_units[0].reference_id;
    if (orderToken && data.status == "COMPLETED") {
      let _order = await Order.findOne({ token: orderToken }).populate(
        "deliver_method"
      );

      // if there is an order - order update
      if (_order) {
        _order.is_paid = true;
        _order.paid_at = new Date();
        _order.save();

        let _person = await Person.findById(_order.person).populate(
          "person_detail address"
        );
        createInvoice(_order, _person, _order.orderNumber);
        paidOrderEmail(_person.person_detail.email, _order.orderNumber);
        return res.redirect(`${process.env.FRONTEND_URL}/checkout/success`);
      }
    }
    return res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
