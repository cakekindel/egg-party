const fkill = require('fkill');

exports.killIfRunning = async function killIfRunning() {
    return await fkill(':9230').catch(e => { });
}
