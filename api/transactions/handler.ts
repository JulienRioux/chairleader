import serverless = require('serverless-http');
import express = require('express');
const app = express();

import { get } from './get';
import { post } from './post';

app.get('/', get);

app.post('/', post);

export const handler = serverless(app);
