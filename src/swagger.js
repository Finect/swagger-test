'use strict';

const swaggerParser = require('swagger-parser');

const fs = require('fs');
const path = require('path');
const newman = require('newman');
const colors = require('colors');

const CollectionError = require('./errors').CollectionError;
const Endpoints = require('./endpoints');

/**
 * @param {string} swagger Path to swagger file
 * @param {object} [options] Options parameters
 * @param {boolean | string} [options.run] Run postman collection using, optionally, data file
 * @param {boolean} [options.save] Save postman collection
 * @param {boolean} [options.production] If production is true, only GET test are executed
 * @param {boolean} [options.ignoreTest] If ignoreTest is true, endpoints marked as x-ignore-test aren`t executed
 * @param {Array<any>} [options.global] Globals options
 * @param {string} [options.tokenUrl] Url to resolve OAuth token (only support grant type: password)
 *
*/
module.exports = async (swagger, options = {}) => {
  /**
   * Disable Tests in production env
   *
   * @param {Array<any>} members
   * @param {Object} options
   * @param {Array} items
   */
  function ignoreTests (members, options, items = []) {
    members.forEach(member => {
      if (member.item) {
        return ignoreTests(member.item, options, items);
      }

      const ignoreItem = (options.ignoreTest || false) && member.disabled;

      if (options.production && ignoreItem === false && member.request.method === 'GET') items.push(member);
      else if (!options.production && ignoreItem === false) items.push(member);
    });

    return items;
  };

  const absSwaggerFile = path.resolve(swagger);
  const absDataFile = options.run && typeof options.run === 'string' ? path.resolve(options.run) : null;
  options.global = options.global || [];

  if (absDataFile) {
    const globalData = require(absDataFile);
    let maxLength = 0;

    process.stdout.write(`\nUsing external data file: ${absDataFile}\n`);
    process.stdout.write('──────────────────────────────────────────────────────');

    Object.keys(globalData).forEach(key => {
      options.global.push({ name: key, value: globalData[key] });
      if (key.length > maxLength) maxLength = key.length;
    });

    (options.global).forEach(option => {
      process.stdout.write(`\n${colors.green(option.name.padStart(maxLength))}: ${option.value}`);
    });

    process.stdout.write('\n──────────────────────────────────────────────────────\n');
  }

  process.chdir(__dirname);

  try {
    const api = await swaggerParser.validate(absSwaggerFile);

    const endpoints = new Endpoints(api, options.global, options.tokenUrl);
    Object.keys(api.paths).forEach(path => {
      endpoints.parse(path, api.paths[path]);
    });

    process.stdout.write('\nTesting endpoints definition\n');

    const result = await endpoints.export(/** @param {string} url */url => {
      process.stdout.write('→ ' + url + '\n');
    });

    if (options.save) {
      const fileCollection = absSwaggerFile.substr(0, absSwaggerFile.lastIndexOf('.')) + '-postman.json';
      fs.writeFileSync(fileCollection, JSON.stringify(result.collection, null, 2));

      process.stdout.write('\nPostman collection exported to: ' + fileCollection + '\n');
    }

    if (!options.run) return result;

    process.stdout.write('\nOption --run detected. Using newman to run collection.\n');

    // @ts-ignore
    result.collection.items.members = ignoreTests(result.collection.items.members, options);

    const newmanOptions = {
      ignoreRedirects: true,
      collection: result.collection,
      reporters: 'cli'
    };

    if (absDataFile) newmanOptions.iterationData = absDataFile;

    return new Promise((resolve, reject) => {
      try {
        newman.run(newmanOptions, (err, summary) => {
          if (err) { throw err; }
          if (summary.run.failures.length > 0) {
            process.stdout.write(summary.run.failures.length + ' assertions failed.\n');
            throw new CollectionError(`${summary.run.failures.length} assertions failed.`);
          }

          process.stdout.write('collection run complete!\n');
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  } catch (err) {
    throw err;
  }
};
