module.exports = {
    apps : [{
        name : 'quantum',
        script : './server.js',
        watch : true,
        log_date_format : "YYYY-MM-DD HH:mm:ss Z",
        env : {
            NODE_ENV : 'development'
        },
        env_production : {
            NODE_ENV : 'production'
        },
        env_staging : {
            NODE_ENV : 'staging'
        }
    }]
};
