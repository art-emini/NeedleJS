const path = require('path');

const { ThreadManager, Types } = require('../dist').default;

const NeedleJS = new ThreadManager();

const myThread = NeedleJS.spawnThread(
  'myThread',
  path.join(__dirname, './thread.js'),
  {
    transferList: { myData: 123 },
  }
);

myThread.on('buzz', (value) => {
  console.log('Message from thread', value);
});

myThread.emit('foo', 'emitted from parent foo');
myThread.emit('bar', 'emitted from parent bar');

myThread.emit('work', 79);
myThread.on('workDone', (value) => {
  const num = value[0];
  console.log('Work done', num);

  myThread.close(0);
  console.log('Closed thread');
});
