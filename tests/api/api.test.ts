import * as strapi from "@strapi/strapi";

import { isValidPostalCode } from "../../src/api/order/services/coverageService";
import {
  createOrderDonateMock,
  createOrderItemMock,
  createOrderMetaMock,
  updateOrderMock,
} from "./ordersMock";

describe("validacion del codigo postal", () => {
  jest.mock("../../src/api/order/services/coverageService", () => ({
    isValidPostalCode: jest.fn(),
  }));

  it("devuelve true si el codigo postal es valido", () => {
    expect(isValidPostalCode("28005")).toBe(true);
    expect(isValidPostalCode("08001")).toBe(true);
    expect(isValidPostalCode("25250")).toBe(true);
  });
  it("devuelve falso si el codigo postal es valido", () => {
    expect(isValidPostalCode("invalid")).toBe(false);
    expect(isValidPostalCode("")).toBe(false);
    expect(isValidPostalCode("28654")).toBe(false);
  });
});


describe("crea la orden de donacion si es superior a 0", () => {
  it("debería crear una nueva orden de donación con orderId válido", async () => {
    const orderId = 1;
    const newOrderDonate = await createOrderDonateMock(orderId);

    expect(newOrderDonate).toBeDefined();
    expect(newOrderDonate.data).toHaveProperty("status", "processing");
    expect(newOrderDonate.data).toHaveProperty("type", "donation");
    expect(newOrderDonate.data).toHaveProperty("user", orderId);
    expect(newOrderDonate).toHaveProperty("id");
    expect(newOrderDonate.id).toBeGreaterThan(0);
  });

  it("debería arrojar un error con orderId no válido", async () => {
    const invalidOrderId = 0;

    await expect(createOrderDonateMock(invalidOrderId)).rejects.toThrowError(
      "Error al crear la orden de donación"
    );
  });

  it("debería arrojar un error si el id es un undefined", async () => {
    const invalidOrderId = undefined;

    await expect(createOrderDonateMock(invalidOrderId)).rejects.toThrowError(
      "Error al crear la orden de donación"
    );
  });
});


describe("updateOrderMock", () => {
  it("debería devolver los datos actualizados si el ID del pedido es mayor que 0", async () => {
    const orderId = 1;
    const updatedData = { status: "processing" };

    try {
      const result = await updateOrderMock(orderId, updatedData);
      expect(result).toEqual({
        data: {
          ...updatedData,
        },
        id: orderId,
      });
    } catch (error) {
      throw error;
    }
  });

  it("debería lanzar un error si el ID del pedido no es válido", async () => {
    const orderId = -1;
    const updatedData = { status: "processing" };

    try {
      await updateOrderMock(orderId, updatedData);
    } catch (error) {
      expect(error.message).toBe("El pedido no existe o el ID no es válido");
    }
  });

  it("debería lanzar un error si un parametro es undefined", async () => {
    const orderId = 123;
    const updatedData = {};

    try {
      await updateOrderMock(orderId, updatedData);
    } catch (error) {
      expect(error.message).toBe("El pedido no existe o el ID no es válido");
    }
  });
});


describe("createOrderItemMock", () => {
  it("debería crear un nuevo ítem de orden con datos válidos", async () => {
    const newOrderDonate = { orderId: 1, otherData: "test" };
    const newItem = await createOrderItemMock(newOrderDonate);

    expect(newItem).toBeDefined();
    expect(newItem).toHaveProperty("id");
    expect(newItem).toHaveProperty("order", newOrderDonate);
    expect(newItem).toHaveProperty("quantity", 1);
    expect(newItem.sku.startsWith("IM ")).toBe(true);
    expect(newItem.price).toBe(0.0);
  });

  it("debería lanzar un error si newOrderDonate está vacío o no se proporciona", async () => {
    await expect(createOrderItemMock({})).rejects.toThrow(
      "Error al crear el nuevo Order Item: newOrderDonate es requerido"
    );
    await expect(createOrderItemMock()).rejects.toThrow(
      "Error al crear el nuevo Order Item: newOrderDonate es requerido"
    );
  });
});


describe("createOrderMetaMock", () => {
  it("deberia arrojar un error si shipping_firstname es undefined", async () => {
    const newOrderMetaData = {
      shipping_postcode: "08001",
    };
    const newOrderDonate = {
      id: 123,
    };

    await expect(createOrderMetaMock(newOrderMetaData, newOrderDonate)).rejects.toThrowError(
      "Error al crear el nuevo Order Meta: se necesita un nombre de envío"
    );
  });

  it("deberia arrojar un error si newOrderDonate está vacio", async () => {
    const newOrderMetaData = {
      shipping_firstname: "User firstname1",
      shipping_postcode: "08001",
    };
    const newOrderDonate = {};

    await expect(createOrderMetaMock(newOrderMetaData, newOrderDonate)).rejects.toThrowError(
      "Error al crear el nuevo Order Meta: new OrderrDonate es requerido"
    );
  });

  it("debería devolver un objeto con las propiedades correctas si la entrada es válida", async () => {
    const newOrderMetaData = {
      shipping_firstname: "User firstname1",
      shipping_postcode: "08001",
    };
    const newOrderDonate = {
      id: 123,
    };

    const result = await createOrderMetaMock(newOrderMetaData, newOrderDonate);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("order", newOrderDonate);
    expect(result).toHaveProperty("shipping_postcode", newOrderMetaData.shipping_postcode);
    expect(result).toHaveProperty("shipping_firstname", newOrderMetaData.shipping_firstname);
  });
});

