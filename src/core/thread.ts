import { Worker, WorkerOptions } from 'node:worker_threads';
import NeedleJS from '..';
import ThreadManager from './threadManager';

export default class Thread {
  public readonly name: string;

  public readonly filename: string;
  public readonly options?: WorkerOptions;
  public threadManager: ThreadManager;

  protected worker: Worker;

  constructor(
    threadManager: ThreadManager,
    name: string,
    filename: string,
    options?: WorkerOptions
  ) {
    this.name = name;

    this.filename = filename;
    this.options = options;
    this.threadManager = threadManager;

    this.worker = new Worker(this.filename, this.options);
  }

  public emit(messageKey: string, ...value: unknown[]) {
    // check for reserved keys
    if (messageKey in NeedleJS.Types.ThreadReservedMessageKeys) {
      throw `Cannot use reserved messageKey ${messageKey} as it is an reserved keyword`;
    }

    this.worker.postMessage({
      messageKey,
      value,
    });
  }

  public on(event: 'online', cb: (...value: unknown[]) => unknown): void;
  public on(event: 'exit', cb: (...value: unknown[]) => unknown): void;
  public on(event: 'messageError', cb: (...value: unknown[]) => unknown): void;
  public on(messageKey: string, cb: (...value: unknown[]) => unknown): void;

  public on(messageKey: string, cb: (...value: unknown[]) => unknown) {
    if (messageKey === 'online') {
      this.worker.on('online', cb);
    }
    if (messageKey === 'exit') {
      this.worker.on('exit', cb);
    }
    if (messageKey === 'messageError') {
      this.worker.on('messageError', cb);
    }

    if (!(messageKey in NeedleJS.Types.ThreadReservedMessageKeys)) {
      this.worker.on('message', (message: NeedleJS.Types.MessageFormat) => {
        if (message.messageKey === messageKey) {
          cb(message.value);
        } else {
          return;
        }
      });
    }
  }

  public close(exit?: number) {
    this.emit(NeedleJS.Types.BuiltInMessageKeys.Shutdown, exit);
  }
}
