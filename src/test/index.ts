import * as dotenv from 'dotenv';
import { startApp } from '../app-setup';

import {} from 'mocha';
import { AppDataSource, dropDB } from '../data-source';

dotenv.config({ path: __dirname + '/../../test.env' });

before(async () => {
  await startApp();
});

after(async () => {
  await dropDB();
});

require('./create-user.test');
require('./login.test');
