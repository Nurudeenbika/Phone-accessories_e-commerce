import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res);
    }).listen(process.env.PORT || 3000, () => {
        console.log('Server running on port', process.env.PORT || 3000);
    });
});