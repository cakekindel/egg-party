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
            user: 'ci_agent',
            host: 'egg-party.com',
            ref: 'origin/master',
            path: '/home/site',
            'post-deploy': '.scripts/postdeploy.sh production',
            repo: 'https://github.com/cakekindel/egg-party.git',
        },
        development: {
            user: 'ci_agent',
            host: 'egg-party.com',
            ref: process.env.DEVELOPMENT_BRANCH || 'origin/master',
            path: '/home/site_dev',
            'post-deploy': '.scripts/postdeploy.sh development',
            repo: 'https://github.com/cakekindel/egg-party.git',
        },
    },
};
