module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: "CodeInTheDark Server",
            script: "index.js",
            env: {
                // COMMON_VARIABLE: "true"
            },
            env_production: {
                NODE_ENV: "production"
            },
            watch: true,
            "ignore_watch": ["node_modules", "public/layouts"],
            "watch_options": {
                "followSymlinks": false
            }
        }


    ],
};