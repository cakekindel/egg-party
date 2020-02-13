const sshOptions = ['StrictHostKeyChecking=no'];

if (process.env.SSH_AUTH_SOCK) {
    sshOptions.push(`IdentityFile=${process.env.SSH_AUTH_SOCK}`);
}

const deployShared = {
    user: 'ci_agent',
    host: 'egg-party.com',
    repo: 'https://github.com/cakekindel/egg-party.git',
    ssh_options: sshOptions,
};

module.exports = {
    apps: [
        {
            name: 'production',
            script: '/home/site/current/dist/src/main.js',
            max_memory_restart: '500M',
            autorestart: true
        },
        {
            name: 'development',
            script: '/home/site_dev/current/dist/src/main.js',
            max_memory_restart: '250M',
            autorestart: false
        },
    ],
    deploy: {
        production: {
            ...deployShared,
            ref: 'origin/master',
            path: '/home/site',
            'post-deploy': '.scripts/postdeploy.sh production',
        },
        development: {
            ...deployShared,
            ref: process.env.DEVELOPMENT_BRANCH || 'origin/master',
            path: '/home/site_dev',
            'pre-deploy': 'git checkout ' + process.env.DEVELOPMENT_BRANCH || 'master',
            'post-deploy': '.scripts/postdeploy.sh development',
        },
    },
};
