import * as dotenv from 'dotenv';
import { startApp } from '../app-setup';

import {} from 'mocha';

dotenv.config({ path: __dirname + '/../../test.env' });

before(async () => {
  await startApp();
});

require('./query.test');
