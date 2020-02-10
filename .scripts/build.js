const { execSync } = require('child_process');

exports.build = function build() {
    try {
        execSync('npm run build');
        return true;
    } catch(e) {
        return false;
    }
}
