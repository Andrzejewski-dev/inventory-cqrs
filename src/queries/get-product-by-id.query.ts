import { ProductModel, toProductDto } from '../models';
import { ProductDto, QueryHandler } from '../types';

export interface GetProductByIdParams {
  id: string;
}

export class GetProductByIdQueryHandler
  implements QueryHandler<GetProductByIdParams, ProductDto | null>
{
  async execute({ id }: GetProductByIdParams): Promise<ProductDto | null> {
    const product = await ProductModel.findById(id);

    return product ? toProductDto(product) : null;
  }
}
