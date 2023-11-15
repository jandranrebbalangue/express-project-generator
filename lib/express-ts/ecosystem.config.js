const currentBranch = `origin/${process.env.BITBUCKET_BRANCH}`

module.exports = {
  apps: [
    {
      name: "mms_bounce_recovery",
      script: "./dist/server.js",
      watch: false,
      env_staging: {
        NODE_ENV: "stage",
        PORT: 4600
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4700
      }
    }
  ],
  deploy: {
    staging: {
      // SSH key path, default to $HOME/.ssh
      key: "/home/jan/.ssh/bitbucket",
      // SSH user
      user: "jan",
      // SSH host
      host: [
        {
          host: "66.85.76.130",
          port: "33033"
        }
      ],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: process.env.BITBUCKET_BRANCH ? currentBranch : "origin/staging",
      // GIT remote
      repo: "git@bitbucket.org:iamruin/mms-bounce-recovery.git",
      // path in the server
      path: "/home/jan/projects/mms-bounce-recovery-staging",
      "post-setup": 'echo "Post-setup action executed"',
      "pre-deploy-local": "./scripts/deploy-staging.sh",
      // post-deploy action
      "post-deploy": `MONGO_URL=${process.env.MONGO_URL} JWT_SECRET=${process.env.JWT_SECRET} pm2 reload ecosystem.config.js --env staging --name mms_bounce_recovery_staging`
    },
    production: {
      // SSH key path, default to $HOME/.ssh
      key: "/home/jan/.ssh/bitbucket",
      // SSH user
      user: "jan",
      // SSH host
      host: [
        {
          host: "66.85.76.130",
          port: "33033"
        }
      ],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "git@bitbucket.org:iamruin/mms-bounce-recovery.git",
      // path in the server
      path: "/home/jan/projects/mms-bounce-recovery",
      "post-setup": 'echo "Post-setup action executed"',
      // post-deploy action
      "post-deploy": `MONGO_URL=${process.env.MONGO_URL} JWT_SECRET=${process.env.JWT_SECRET} pm2 reload ecosystem.config.js --env production --name mms_bounce_recovery`
    }
  }
}
