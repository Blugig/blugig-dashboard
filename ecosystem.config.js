module.exports = {
    apps: [
        {
            name: "dashboard",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3000", // or your desired port
            cwd: "/home/ubuntu/Blugig-Dashboard-Backend/dashboard", // adjust path if different
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
