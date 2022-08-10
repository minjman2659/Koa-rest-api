import 'env';
import Server from 'server';

const { PORT } = process.env;

const server: Server = new Server();

server.listen(Number(PORT));
