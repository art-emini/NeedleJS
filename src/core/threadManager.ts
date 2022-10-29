import { WorkerOptions } from 'node:worker_threads';

import Thread from './thread';

export default class ThreadManager {
  public threads: Record<string, Thread>;

  constructor() {
    this.threads = {};
  }

  public spawnThread(name: string, filename: string, options?: WorkerOptions) {
    const thread = new Thread(this, name, filename, options);

    this.threads[name] = thread;

    return thread;
  }

  public closeThread(name: string, exit?: number) {
    const thread: Thread | undefined | null = this.threads[name];

    if (thread) {
      thread.close(exit);
    }
  }
}
