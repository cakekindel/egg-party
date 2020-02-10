const { watchDist } = require('./watch-dist');
const { start } = require('./start');

(function serve() {
    watchDist(async () => {
        await start();
    });
})();
