/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { isValidPostalCode } from '../services/coverageService'
import { updateOrder, createOrder } from '../services/order';


export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async donate (ctx): Promise<any> {
    try {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      const authenticatedUser = ctx.state.user;
      const { order_meta } = ctx.request.body;
      const order = await strapi.service('api::order.order').findOne(sanitizedQueryParams, { populate: ['order_items', 'order_meta'] });
      

      if (!isValidPostalCode(order_meta.shipping_postcode)) {
        return ctx.throw(400, 'Código postal inválido');
      }

      const updatedOrder = await updateOrder(order.id, { status: 'cancelled' });

      const newOrderData = {
        status: 'processing',
        type: 'donation',
        user: order.id,
      };
      const newOrder = await createOrder(newOrderData);

      return {updatedOrder, newOrder}
      // return {order, updatedOrder, newOrder, order_meta, authenticatedUser};
    } catch (error) {
      console.error('Error exporting orders', error);
      return ctx.status = 500;
    }
  },
}));
