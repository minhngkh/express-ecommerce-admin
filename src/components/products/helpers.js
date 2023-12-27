exports.processSearchQuery = (searchQuery) => {
  return {
    categoryId: Object.hasOwn(searchQuery, "category")
      ? Number(searchQuery.category)
      : null,

    subcategoryId: Object.hasOwn(searchQuery, "subcategory")
      ? Number(searchQuery.subcategory)
      : null,

    brandId: Object.hasOwn(searchQuery, "brand")
      ? Number(searchQuery.brand)
      : null,

    name: Object.hasOwn(searchQuery, "name") ? searchQuery.name : null,

    limit: Object.hasOwn(searchQuery, "limit")
      ? Number(searchQuery.limit)
      : null,

    page: Object.hasOwn(searchQuery, "page") ? Number(searchQuery.page) : null,

    sort: Object.hasOwn(searchQuery, "sort") ? searchQuery.sort : null,
  };
};
