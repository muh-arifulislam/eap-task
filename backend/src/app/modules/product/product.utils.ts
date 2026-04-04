import { IGetProductsQuery } from "./product.interface";

export const parseQueryParams = (
  query: Record<string, unknown>,
): IGetProductsQuery => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;

  const id = query.id ? String(query.id) : "";
  const status = query.status ? String(query.status) : "";
  const isActive = query.isActive ? String(query.isActive) : "";

  return {
    page,
    limit,
    id,
    status,
    isActive,
  };
};
