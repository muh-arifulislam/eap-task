import { GetOrdersQuery, TOrderStatus } from "./order.interface";

export const parseQueryParams = (
  query: Record<string, unknown>,
): GetOrdersQuery => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;

  const orderId = query.orderId ? String(query.orderId) : "";
  const status = query.status ? String(query.status) : "";

  const startDate = query.startDate ? String(query.startDate) : "";
  const endDate = query.endDate ? String(query.endDate) : "";

  return {
    page,
    limit,
    orderId,
    status: status as TOrderStatus,
    startDate,
    endDate,
  };
};
