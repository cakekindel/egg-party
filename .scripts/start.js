const { spawn } = require('child_process');
const { killIfRunning } = require('./kill-if-running');

exports.start = async function start() {
    await killIfRunning();
    return spawn('npm run start')
        .addListener('error', (e) => {
            process.stderr.write(e.message);
        })
        .addListener('message', (message) => {
            process.stdout.write(message);
        });
};
