export const orderStatuses = [
  'review',
  'packaging',
  'delivery in progress',
  'delivered',
  'cancelled',
] as const;

export type status = (typeof orderStatuses)[number];
