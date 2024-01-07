const { and, desc, eq, sql } = require("drizzle-orm");

const db = require("#db/client");
const {
  order,
  orderItem,
  address,
  product,
  productCategory,
  productImage,
} = require("#db/schema");

const UtcTimeField = sql`strftime('%Y-%m-%dT%H:%M:%fZ', ${order.createdAt})`;

/**
 * @typedef {object} Address
 * @property {string} fullName
 * @property {string} phoneNumber
 * @property {string} addressLine1
 * @property {string} [addressLine2]
 * @property {string} district
 * @property {string} cityOrProvince
 */

exports.getOrderDetails = (orderId) => {
  const query = db
    .select({
      id: order.id,
      createdAt: UtcTimeField,
      status: order.status,
      total: order.total,
      address: {
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        district: address.district,
        cityOrProvince: address.cityOrProvince,
      },
    })
    .from(order)
    .innerJoin(address, eq(address.id, order.addressId))
    .where(eq(order.id, orderId))
    .limit(1);

  return query.then((val) => {
    return val.length ? val[0] : null;
  });
};

exports.getOrderItems = (orderId) => {
  const query = db
    .select({
      productId: orderItem.productId,
      category: productCategory.name,
      name: product.name,
      price: orderItem.price,
      quantity: orderItem.quantity,
      image: productImage.source,
    })
    .from(orderItem)
    .innerJoin(product, eq(orderItem.productId, product.id))
    .innerJoin(productCategory, eq(productCategory.id, product.categoryId))
    .leftJoin(
      productImage,
      and(
        eq(productImage.productId, product.id),
        eq(productImage.isPrimary, true),
      ),
    )
    .where(eq(orderItem.orderId, orderId));

  return query;
};

exports.getOrders = (userId) => {
  const query = db
    .select({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
    })
    .from(order)
    .where(eq(order.userId, userId))
    .orderBy(desc(order.createdAt));

  return query;
};

exports.updateOrderStatus = (orderId, status) => {
  const query = db
    .update(order)
    .set({ status: status })
    .where(eq(order.id, orderId));

  return query;
};
