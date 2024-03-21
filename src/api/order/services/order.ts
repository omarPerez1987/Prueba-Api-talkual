/**
 * order service
 */

import { factories } from "@strapi/strapi";

export const updateOrder = async (
  orderId: number,
  updatedData: any
): Promise<any> => {
  try {
    const updatedOrder = await strapi.entityService.update(
      "api::order.order",
      orderId,
      {
        data: updatedData,
      }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    throw error;
  }
};

export const createOrderDonate = async (orderId: number): Promise<any> => {
  try {
    const newOrderDonate = await strapi.entityService.create('api::order.order', {
      data: {
        status: 'processing',
        type: 'donation',
        user: orderId,
      }
    });

    return newOrderDonate;
  } catch (error) {
    console.error('Error al crear el nuevo pedido:', error);
    throw error;
  }
};

export default factories.createCoreService("api::order.order");
