const { ThreadSelf } = require('../dist').default;

const self = new ThreadSelf();

self.on('foo', (value) => {
  console.log('received on key foo', value);
  self.emit('buzz', 'sent from worker on foo');
});

self.on('bar', (value) => {
  console.log('received on key bar', value);
  self.emit('buzz', 'sent from worker on bar');
});

self.on('work', (value) => {
  const num = value[0];

  self.emit('workDone', num * 2);
});
