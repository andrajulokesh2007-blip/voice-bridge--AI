import net from 'net';

const client = net.createConnection({ port: 27017, host: '127.0.0.1' }, () => {
  console.log('STATUS: LOCAL_MONGO_RUNNING');
  client.end();
  process.exit(0);
});

client.on('error', (err) => {
  console.log('STATUS: LOCAL_MONGO_NOT_RUNNING (' + err.message + ')');
  process.exit(0);
});
