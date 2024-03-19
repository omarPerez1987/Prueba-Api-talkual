/**
 * order service
 */

import { factories } from '@strapi/strapi';

export const updateOrder = async (orderId: number, updatedData: any): Promise<any> => {
    try {
      const updatedOrder = await strapi.entityService.update('api::order.order', orderId, {
        data: updatedData,
      });
      console.log(updatedOrder)
      return updatedOrder;
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      throw error;
    }
  };
  
export const createOrder = async (newOrderData: any): Promise<any> => {
    try {
      const newOrder = await strapi.entityService.create('api::order.order', {
        data: newOrderData,
      });
      return newOrder;
    } catch (error) {
      console.error('Error al crear el nuevo pedido:', error);
      throw error;
    }
  };

export default factories.createCoreService('api::order.order');
