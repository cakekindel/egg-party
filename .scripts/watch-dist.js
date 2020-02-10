const { watch } = require('fs');

exports.watchDist = function watchDist(cb) {
    const opts = { recursive: true, encoding: 'utf8' };
    let distWatcher;
    let rootWatcher;

    function onDistChange() {
        cb();
    }

    function onRootChange(_, filename) {
        if (!distWatcher
            && (filename || '').includes('dist')
        ) {
            onDistChange();
        }
    }

    rootWatcher = watch('./', opts, onRootChange);
}
