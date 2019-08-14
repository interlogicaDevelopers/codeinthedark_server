module.exports = {

    apps: [{
        name: 'server',
        script: 'src/index.js',
        watch: ['src/db', "src/index.js"],
        ignore_watch: ["node_modules", "src/public"],
        watch_options: {
            "followSymlinks": false
        },
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]

};
