// @flow

import { createConnection } from '../infrastructure/utils/database';
import initializeApp from './app';

const port = process.env.EXPRESS_PORT || 3000;
const connection = createConnection();
const app = initializeApp(connection);

app.listen(port, () => console.log(`Listening on port ${port}`));
