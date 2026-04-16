import 'dotenv/config';

import { createApp } from './app';
import { getServerEnv } from './lib/env';

const port = getServerEnv().PORT;
const app = createApp();

app.listen(port, () => {
  console.log(`Offer Lens server listening on ${port}`);
});
