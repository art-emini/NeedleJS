import { exit } from 'node:process';
import { parentPort, MessagePort, workerData } from 'node:worker_threads';
import NeedleJS from '../';

export default class ThreadSelf {
  public parentPort: MessagePort;
  public data: unknown;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.parentPort = parentPort!;

    this.data = workerData;
  }

  public emit(messageKey: string, ...value: unknown[]) {
    // check for reserved keys
    if (messageKey in NeedleJS.Types.ThreadSelfReservedMessageKeys) {
      throw new Error(
        `Cannot use reserved messageKey ${messageKey} as it is a reserved keyword`
      );
    }

    this.parentPort.postMessage({
      messageKey,
      value,
    });
  }

  public on(event: 'close', cb: (...value: unknown[]) => unknown): void;
  public on(event: 'messageError', cb: (...value: unknown[]) => unknown): void;
  public on(messageKey: string, cb: (...value: unknown[]) => unknown): void;

  public on(messageKey: string, cb: (...value: unknown[]) => unknown) {
    if (messageKey in NeedleJS.Types.BuiltInMessageKeys) {
      throw new Error(
        `Cannot use reserved built in messageKey ${messageKey} as it is a built in reserved keyword`
      );
    }

    if (messageKey === 'close') {
      this.parentPort.on('close', cb);
    }
    if (messageKey === 'messageError') {
      this.parentPort.on('messageError', cb);
    }

    if (!(messageKey in NeedleJS.Types.ThreadSelfReservedMessageKeys)) {
      this.parentPort.on('message', (message: NeedleJS.Types.MessageFormat) => {
        if (message.messageKey === messageKey) {
          cb(message.value);
        } else {
          return;
        }
      });
    }

    // build ins
    this.parentPort.on('message', (message: NeedleJS.Types.MessageFormat) => {
      if (message.messageKey === 'NEEDLEJS-THREAD-SHUTDOWN') {
        exit(message.value[0] as number);
      }
    });
  }
}
