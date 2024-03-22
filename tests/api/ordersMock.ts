export const createOrderDonateMock = jest
  .fn()
  .mockImplementation(async (orderId: number) => {
    if (orderId > 0) {
      return {
        data: {
          status: "processing",
          type: "donation",
          user: orderId,
        },
        id: 1,
      };
    } else {
      throw new Error("Error al crear la orden de donación");
    }
  });

export const updateOrderMock = jest
  .fn()
  .mockImplementation(async (orderId: number, updatedData: any) => {
    if (orderId > 0) {
      return {
        data: {
          ...updatedData,
        },
        id: orderId,
      };
    } else {
      throw new Error("El pedido no existe o el ID no es válido");
    }
  });

export const createOrderItemMock = jest
  .fn()
  .mockImplementation(async (newOrderDonate) => {
    if (!newOrderDonate || Object.keys(newOrderDonate).length === 0) {
      throw new Error(
        "Error al crear el nuevo Order Item: newOrderDonate es requerido"
      );
    } else {
      return {
        id: Math.floor(Math.random() * 1000),
        order: newOrderDonate,
        quantity: 1,
        sku: `IM ${Math.floor(Math.random() * 1000)}`,
        price: 0.0,
        ...newOrderDonate,
      };
    }
  });
