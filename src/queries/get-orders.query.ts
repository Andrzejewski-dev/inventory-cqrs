import { OrderModel, toOrderDto } from '../models';
import { OrderDto, QueryHandler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetOrdersParams {}

export class GetOrdersQueryHandler
  implements QueryHandler<GetOrdersParams, OrderDto[]>
{
  async execute(): Promise<OrderDto[]> {
    return (await OrderModel.find()).map(toOrderDto);
  }
}
