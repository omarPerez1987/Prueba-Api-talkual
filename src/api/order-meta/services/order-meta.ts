/**
 * order-meta service
 */

import { factories } from "@strapi/strapi";

export const createOrderMeta = async (newOrderMetaData: any, newOrderDonate: number): Promise<any> => {
  try {
    const newOrderMeta = await strapi.entityService.create(
      "api::order-meta.order-meta",
      {
        data: {
          order: newOrderDonate,
          ...newOrderMetaData,
        },
      }
    );

    return newOrderMeta;
  } catch (error) {
    console.error("Error al crear el nuevo Order Meta:", error);
    throw error;
  }
};


export default factories.createCoreService("api::order-meta.order-meta");
