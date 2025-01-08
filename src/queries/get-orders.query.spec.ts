import { OrderModel, toOrderDto } from '../models';
import { GetOrdersQueryHandler } from './get-orders.query';

jest.mock('../models');

describe('getOrders', () => {
  let handler: GetOrdersQueryHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new GetOrdersQueryHandler();
  });

  it('should return a list of orders', async () => {
    const mockOrders = [
      { _id: 'order1', customerId: 'customer1', products: [], total: 100 },
      { _id: 'order2', customerId: 'customer2', products: [], total: 200 },
    ];

    const mockOrderDto = [
      { id: 'order1', customerId: 'customer1', total: 100 },
      { id: 'order2', customerId: 'customer2', total: 200 },
    ];

    (OrderModel.find as jest.Mock).mockResolvedValue(mockOrders);
    (toOrderDto as jest.Mock).mockImplementation((order) => ({
      id: order._id,
      customerId: order.customerId,
      total: order.total,
    }));

    const orders = await handler.execute();

    expect(OrderModel.find).toHaveBeenCalled();
    expect(toOrderDto).toHaveBeenCalledTimes(2);
    expect(orders).toEqual(mockOrderDto);
  });

  it('should return an empty list if no orders are found', async () => {
    (OrderModel.find as jest.Mock).mockResolvedValue([]);

    const orders = await handler.execute();

    expect(OrderModel.find).toHaveBeenCalled();
    expect(orders).toEqual([]);
  });

  it('should handle errors when fetching orders', async () => {
    (OrderModel.find as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(handler.execute()).rejects.toThrow('Database error');
  });
});
