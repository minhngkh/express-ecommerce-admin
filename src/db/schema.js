const { sql } = require("drizzle-orm");
const {
  integer,
  primaryKey,
  sqliteTable,
  text,
} = require("drizzle-orm/sqlite-core");

const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  avatar: text("avatar"),
  createdAt: text("created_at").default(sql`current_timestamp`),
});

const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  brand: text("brand").notNull(),
  image: text("image").notNull(),
});

const laptopProducts = sqliteTable("laptop_products", {
  id: integer("id")
    .primaryKey()
    .references(() => products.id),
  subcategory: text("subcategory"),
  cpu: text("cpu"),
  resolution: text("resolution"),
  ram: text("ram"),
  storage: text("storage"),
});

const productReviews = sqliteTable(
  "product_reviews",
  {
    productId: integer("product_id").references(() => products.id),
    userId: integer("user_id").references(() => users.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: text("created_at").default(sql`current_timestamp`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.productId, table.userId] }),
    };
  },
);

const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  createdAt: text("created_at").default(sql`current_timestamp`),
});

module.exports = {
  users,
  products,
  laptopProducts,
  productReviews,
  admins,
};
