export interface CommandHandler<TParams> {
  execute(params: TParams): Promise<void>;
}

export interface QueryHandler<TParams, TResult> {
  execute(params: TParams): Promise<TResult>;
}

export interface ICommandBus {
  register<TParams>(name: string, handler: CommandHandler<TParams>): void;
  execute<TParams>(name: string, params: TParams): Promise<void>;
}

export interface IQueryBus {
  register<TParams, TResult>(
    name: string,
    handler: QueryHandler<TParams, TResult>,
  ): void;
  execute<TParams, TResult>(name: string, input: TParams): Promise<TResult>;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface OrderDto {
  id: string;
  customerId: string;
  total: number;
  createdAt: number;
  products: {
    productId: string;
    quantity: number;
  }[];
}
