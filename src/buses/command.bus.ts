import { EventEmitter } from 'events';
import { CommandHandler, ICommandBus } from '../types';

export class CommandBus implements ICommandBus {
  private eventEmitter = new EventEmitter();

  register<TInput>(name: string, handler: CommandHandler<TInput>): void {
    this.eventEmitter.on(name, handler.execute.bind(handler));
  }

  async execute<TInput>(name: string, input: TInput): Promise<void> {
    this.eventEmitter.emit(name, input);
  }
}
