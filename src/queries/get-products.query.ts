import { ProductModel, toProductDto } from '../models';
import { ProductDto, QueryHandler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetProductsParams {}

export class GetProductsQueryHandler
  implements QueryHandler<GetProductsParams, ProductDto[]>
{
  async execute(): Promise<ProductDto[]> {
    return (await ProductModel.find()).map(toProductDto);
  }
}
