/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import { isValidPostalCode } from "../services/coverageService";
import { updateOrder, createOrderDonate } from "../services/order";
import { createOrderMeta } from "../../order-meta/services/order-meta";
import { createOrderItem } from "../../order-item/services/order-item";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async donate(ctx): Promise<any> {
      try {
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const authenticatedUser = ctx.state.user;
        const { order_meta } = ctx.request.body;
        const order = await strapi
          .service("api::order.order")
          .findOne(sanitizedQueryParams, {
            populate: ["order_items", "order_meta"],
          });

        if (!isValidPostalCode(order_meta.shipping_postcode)) {
          return ctx.throw(400, "Código postal inválido");
        }

        const updatedOrder = await updateOrder(order.id, {
          status: "cancelled",
        });

        const newOrderDonate = await createOrderDonate(order.id);
        const newOrderMeta = await createOrderMeta(order_meta, newOrderDonate);
        const newOrderItem = await createOrderItem(newOrderDonate);

        if (newOrderDonate && newOrderMeta && newOrderItem) {
          console.log(
            `${newOrderMeta.shipping_firstname} su pedido se enviara en breve `
          );
        }

        return {
          data: {
            newOrderDonate,
            newOrderMeta,
            newOrderItem,
          },
        };
      } catch (error) {
        console.error("Error exporting orders", error);
        return (ctx.status = 500);
      }
    },
  })
);
