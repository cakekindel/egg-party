const deployShared = {
    user: 'ci_agent',
    host: 'egg-party.com',
    repo: 'https://github.com/cakekindel/egg-party.git',
    ssh_options: process.env.SSH_AUTH_SOCK
        ? `IdentityFile=${process.env.SSH_AUTH_SOCK}`
        : undefined,
};

module.exports = {
    apps: [
        {
            name: 'production',
            script: '/home/site/current/dist/src/main.js',
            max_memory_restart: '500M',
            autorestart: true,
            env: {
                NODE_ENV: 'production',
                ENVIRONMENT: 'Production',
                TYPEORM_DATABASE: 'EggParty',
            },
        },
        {
            name: 'development',
            script: '/home/site_dev/current/dist/src/main.js',
            max_memory_restart: '250M',
            autorestart: true,
            env: {
                NODE_ENV: 'development',
                ENVIRONMENT: 'Development',
                TYPEORM_DATABASE: 'EggPartyDev',
            },
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
            'post-deploy': '.scripts/postdeploy.sh development',
        },
    },
};
