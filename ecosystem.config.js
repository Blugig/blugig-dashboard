module.exports = {
    apps: [
        {
            name: "dashboard",

            // Tell PM2 to execute the 'npm' command
            script: "npm",

            // Provide arguments to npm. This will execute the 'start' script
            // defined in your package.json.
            // The '--' separator passes the '-p 3000' argument directly to the underlying 'next start' command.
            args: "start -- -p 3000",

            // The working directory where package.json is located
            cwd: "/home/ubuntu/blugig-dashboard",

            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
