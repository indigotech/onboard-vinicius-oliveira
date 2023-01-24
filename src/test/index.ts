import * as dotenv from 'dotenv';
import { startApp } from '../app-setup';

import {} from 'mocha';
import { cleanDB } from '../data-source';

dotenv.config({ path: __dirname + '/../../test.env' });

before(async () => {
  await startApp();
});

after(async () => {
  await cleanDB();
});

/*
require('./create-user.test');
require('./find-user.test');
require('./login.test');
*/

require('./find-users.test');
