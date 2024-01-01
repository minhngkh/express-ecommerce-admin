const DefaultListLimit = 12;

/**
 *
 * @param {Object} searchQuery
 * @param {string} [searchQuery.category]
 * @param {string} [searchQuery.subcategory]
 * @param {string} [searchQuery.brand]
 * @param {string} [searchQuery.status]
 * @param {string} [searchQuery.name]
 * @param {string} [searchQuery.limit]
 * @param {string} [searchQuery.page]
 * @param {string} [searchQuery.sort]
 * @returns
 */
exports.processSearchQuery = (searchQuery) => {
  return {
    categoryId: searchQuery.category ? Number(searchQuery.category) : null,

    subcategoryIds: searchQuery.subcategory
      ? searchQuery.subcategory.split(",").map((e) => Number(e))
      : null,

    brandIds: searchQuery.brand
      ? searchQuery.brand.split(",").map((e) => Number(e))
      : null,

    status: searchQuery.status ? searchQuery.status : null,

    name: searchQuery.name ? searchQuery.name : null,

    limit: searchQuery.limit ? Number(searchQuery.limit) : DefaultListLimit,

    page: searchQuery.page ? Number(searchQuery.page) : 1,

    sort: searchQuery.sort ? searchQuery.sort : null,
  };
};
