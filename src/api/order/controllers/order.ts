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
        const { authenticatedUser } = ctx.state.user;
        const { order_meta } = ctx.request.body;
        const idParams = Number(ctx.params.id);

        const order = await strapi
          .service("api::order.order")
          .findOne(sanitizedQueryParams, {
            populate: ["order_items", "order_meta"],
          });

        if (!order) {
          return ctx.throw(404, "La orden especificada no fue encontrada");
        }

        if (!isValidPostalCode(order_meta.shipping_postcode)) {
          return ctx.throw(400, "Código postal inválido");
        }

        const updatedOrder = await updateOrder(idParams, {
          status: "cancelled",
        });

        if (updatedOrder.type !== "donation") {
          const newOrderDonate = await createOrderDonate(order);
          const newOrderMeta = await createOrderMeta(
            order_meta,
            newOrderDonate
          );
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
        } else {
          console.log('La donación se ha enviado')
        }
      } catch (error) {
        console.error("Error exporting orders", error);
        return (ctx.status = 500);
      }
    },
  })
);
