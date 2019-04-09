/**
 * @file 构建脚本
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-console */

const {error, stopSpinner} = require('@vue/cli-shared-utils');
const execa = require('execa');
const {getConfig} = require('./scripts/getConfig');

async function build(cmd) {
    const {config, target, buildPath} = getConfig(cmd);

    const {
        build
    } = require(buildPath + '/src/scripts/run');


    process.env.NODE_ENV = 'production';

    build(config, {
        target,
        build: true
    }).on('stop', () => {
        if (target === 'h5') {
            const child = execa('npm', ['run', 'build-dist-h5']);
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        }
    });
}

module.exports = (...args) =>
    build(...args).catch(err => {
        stopSpinner(false); // do not persist
        error(err);
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1);
        }
    });
