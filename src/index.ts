import ThreadManagerClass from './core/threadManager';
import ThreadClass from './core/thread';
import ThreadSelfClass from './core/threadSelf';

namespace NeedleJS {
  export const ThreadManager = ThreadManagerClass;
  export const Thread = ThreadClass;
  export const ThreadSelf = ThreadSelfClass;

  export namespace Types {
    export enum BuiltInMessageKeys {
      Shutdown = 'NEEDLEJS-THREAD-SHUTDOWN',
    }

    export enum ThreadReservedMessageKeys {
      'online',
      'exit',
      'messageError',
    }
    export enum ThreadSelfReservedMessageKeys {
      'close',
      'messageError',
    }

    export interface MessageFormat {
      messageKey: string;
      value: unknown[];
    }
  }
}

export default NeedleJS;
