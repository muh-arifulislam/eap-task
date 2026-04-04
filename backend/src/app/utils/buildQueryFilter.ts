export const buildQueryFilter = (
  query: Record<string, any>,
  searchableFields: string[],
) => {
  const filter: Record<string, any> = {};

  if (query.search) {
    filter.$or = searchableFields.map((field) => ({
      [field]: {
        $regex: query.search,
        $options: "i",
      },
    }));
  }

  Object.keys(query).forEach((key) => {
    if (key !== "search" && query[key]) {
      filter[key] = query[key];
    }
  });

  return filter;
};
