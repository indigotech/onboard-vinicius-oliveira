import * as dotenv from 'dotenv';
import { startApp } from '../app-setup';

import {} from 'mocha';
import { dropDB } from '../data-source';

dotenv.config({ path: __dirname + '/../../test.env' });

before(async () => {
  await startApp();
});

require('./query.test');
require('./create-user.test');

after(async () => {
  await dropDB();
});
