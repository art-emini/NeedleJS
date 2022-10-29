# NeedleJS Docs

## ThreadManager

The main class of NeedleJS. Creates and manages Threads. Only to be used on the main file.

### ThreadManager Props

- *public* threads: `Record<string, unknown>`
  - An object of all the Thread classes created and spawned

### ThreadManager Methods

- *public* spawnThread(`name: string, filename: string, options?: WorkerOptions`): `Thread`
  - Creates the Thread class using the passed arguments and adds it to the threads object.

- *public* closeThread(`name: string, exit?: number`): `boolean`
  - Finds a thread in the threads object by its passed name and calls the Thread.close method on the found thread. Returns boolean based on if Thread was found and closed or not.

## Thread

A class that manages and wraps the NodeJS Worker class. Only to be used on the main file.

### Thread Props

- *public readonly* name: `string`
  - The name of the Thread in the ThreadManager.threads object.

- *public readonly* filename: `string`
  - The path to the file to be used as the Worker.

- *public readonly* options: `WorkerOptions | undefined`
  - The options for the NodeJS Worker, optional, might be undefined.

- *protected* worker: `Worker`
  - The NodeJS Worker class.

### Thread Methods

- *public* emit(`messageKey: string, ...value: unknown[]`)
  - Wrapper to NodeJS Worker.postMessage but adds a way to use a key as well as pass values to a specific key. Posts a message to the Worker with a key and an array of values.

- *public* on(`messageKey: string, cb: (...value: unknown[]) => unknown`): `void`
  - Wrapper to NodeJS Worker.on but with message keys. Sets a listener to listen for a message key and to run a callback on the event. Listens for message from Worker.

  - *overload public* on(`event: 'online', cb: (...value: unknown[]) => unknown`): `void`;
    - Wrapper to NodeJS Worker.on('online'), overload for specific built in event.

  - *overload public* on(`event: 'exit', cb: (...value: unknown[]) => unknown`): `void`;
    - Wrapper to NodeJS Worker.on('exit'), overload for specific built in event.

  - *overload public* on(`event: 'messageError', cb: (...value: unknown[]) => unknown`): `void`;
    - Wrapper to NodeJS Worker.on('messageError'), overload for specific built in event.

- *public* close(`exit?: number`): `void`
  - Calls Thread.emit with the messageKey being a built in NeedleJS message key to call for a shutdown of the Thread. If exit code is passed, Worker will exit with that code.

## ThreadSelf

A class that manages and wraps the NodeJS parentPort class. Only to be used on the Worker.

### ThreadSelf Props

- *public* parentPort: `MessagePort`
  - The parentPort imported from node:worker_threads
- *public* data: `unknown`
  - The workerData imported from node:worker_threads

### ThreadSelf Methods

- *public* emit(`messageKey: string, ...value: unknown[]`): `void`
  - Wrapper to NodeJS parentPort.postMessage but adds a way to use a key as well as pass values to a specific key. Posts a message to the parentPort with a key and an array of values.
  
- *public* on(`messageKey: string, cb: (...value: unknown[]) => unknown`): `void`
  - Wrapper to NodeJS parentPort.on but with message keys. Sets a listener to listen for a message key and to run a callback on the event. Listens for message from parentPort.

  - *overload public* on(`event: 'close', cb: (...value: unknown[]) => unknown`): `void`;
    - Wrapper to NodeJS parentPort.on('close'), overload for specific built in event.

  - *overload public* on(`event: 'messageError', cb: (...value: unknown[]) => unknown`): `void`;
    - Wrapper to NodeJS parentPort.on('messageError'), overload for specific built in event.
