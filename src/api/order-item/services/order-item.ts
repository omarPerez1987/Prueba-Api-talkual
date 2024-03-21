/**
 * order-item service
 */

import { factories } from "@strapi/strapi";

export const createOrderItem = async (newOrderDonate: any): Promise<any> => {
  console.log(newOrderDonate);
  try {
    const newOrderItem = await strapi.entityService.create(
      "api::order-item.order-item",
      {
        data: {
          order: newOrderDonate,
          quantity: 1,
          sku: "sku_value",
          price: 0.0,
          ...newOrderDonate,
        },
      }
    );

    return newOrderItem;
  } catch (error) {
    console.error("Error al crear el nuevo Order Item:", error);
    throw error;
  }
};

export default factories.createCoreService("api::order-item.order-item");
