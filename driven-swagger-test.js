#!/usr/bin/env node
'use strict';

const program = require('commander');
const swagger = require('./src/swagger');
// @ts-ignore
const pkg = require('./package.json');

program
  .version(pkg.version, '-v, --version')
  .usage('<JSON or YAML Swagger file definition> [options]')
  .arguments('<file>')
  .option('-g --global [var]', 'Add global variables', (option, options) => {
    try {
      option.split(',').forEach(e => {
        var global = e.trim().split('=');
        options.push({ name: global[0].trim(), value: global[1].trim() });
      });
    } catch (err) {
      process.stdout.write('Invalid global variables option. Use var1=value1,var2=value2\n');
      throw err;
    }

    return options;
  }, [])
  .option('-r, --run [dataFile]', 'Run postman collection using newman cli.')
  .option('-s, --save', 'Save postman collection to disk')
  .option('-t, --tokenUrl [tokenUrl]', 'Override token url in swagger.')
  .description('Create Postman collection with test from swagger')
  .action((req, options) => {
    swagger(req, options).catch(err => {
      process.stdout.write('Oh-noes! :-( ' + err.stack || err.message + '\n');
      throw err;
    });
  });

program.parse(process.argv);

if (!program.args.length) program.help();
