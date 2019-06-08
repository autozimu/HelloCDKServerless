#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { HelloCdkServerlessStack } from '../lib/hello_cdk_serverless-stack';

const app = new cdk.App();
new HelloCdkServerlessStack(app, 'HelloCdkServerlessStack');
