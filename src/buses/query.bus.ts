import { IQueryBus, QueryHandler } from '../types';

export class QueryBus implements IQueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map();

  register<TInput, TResult>(
    name: string,
    handler: QueryHandler<TInput, TResult>,
  ): void {
    if (this.handlers.has(name)) {
      throw new Error(`Handler for bus "${name}" is already registered.`);
    }
    this.handlers.set(name, handler);
  }

  async execute<TInput, TResult>(
    name: string,
    command: TInput,
  ): Promise<TResult> {
    const handler = this.handlers.get(name);
    if (!handler) {
      throw new Error(`No handler registered for "${name}".`);
    }
    return handler.execute(command);
  }
}
