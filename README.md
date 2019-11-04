# Egg Party 🥚🎉

### Egg party is a Slack App for thanking teammates, raising chickens, and having a rowdy ol' time

---
#### Table of Contents
- [Egg Party 🥚🎉](#egg-party-%f0%9f%a5%9a%f0%9f%8e%89)
    - [Egg party is a Slack App for thanking teammates, raising chickens, and having a rowdy ol' time](#egg-party-is-a-slack-app-for-thanking-teammates-raising-chickens-and-having-a-rowdy-ol-time)
      - [Table of Contents](#table-of-contents)
  - [* Helpful Links](#helpful-links)
    - [**Want to contribute?**](#want-to-contribute)
      - [**Requirements:**](#requirements)
      - [**First-Time Setup:**](#first-time-setup)
        - [DB Setup with MS SQL](#db-setup-with-ms-sql)
          - [DB Setup Troubleshooting Notes](#db-setup-troubleshooting-notes)
        - [Slack Setup](#slack-setup)
      - [**Local Configuration Files**](#local-configuration-files)
    - [**Running & Debugging (VS Code)**](#running--debugging-vs-code)
        - [Note: You'll need to change the Events Request URL and Interactions Request URL every time you start a new ngrok session.](#note-youll-need-to-change-the-events-request-url-and-interactions-request-url-every-time-you-start-a-new-ngrok-session)
    - [**Helpful Links:**](#helpful-links)
---

### **Want to contribute?**

#### **Requirements:**

* Read: [Contributing Guidelines](CONTRIBUTING.md)
* Install: [SQL Server Express or Developer][sql-server-download]
* Install: [ngrok]
* Install: [Node v10+][node-download]
    * Install: [Azure Functions Core Tools][func-install]
    * Install: [TypeORM CLI][typeorm-install]

#### **First-Time Setup:**

* Clone this repo
* Run `npm install`
* Create both of the [Local Config Files](#local-configuration-files)

##### DB Setup with MS SQL
* Create a local database named `EggParty`
* Ensure your local database has [SQL Server Auth enabled][sql-server-auth-mode]
* [Create a local SQL administrator][create-sql-admin] with user/pass matching those in `ormconfig.json`
    * *It doesn't have to be admin/password, just make sure `ormconfig.json` has the correct credentials.*
* In a shell in `egg-party/`, run `npm run build`, then `typeorm migration:run -c Local` to initialize your schema

###### DB Setup Troubleshooting Notes
*  The application may run into an issue connecting to your newly installed SQL Server database. You may encounter the following error:<br />
   ```javascript
   Failed to connect to localhost:1433 - Could not connect (sequence)
   ```
   This error is documented under issue [#2333](https://github.com/typeorm/typeorm/issues/2133) in the [typeorm](https://github.com/typeorm) project. In order to address it...
   1. You will need to [enable TCP connections to SQL Server](https://stackoverflow.com/questions/25577248/node-js-mssql-tedius-connectionerror-failed-to-connect-to-localhost1433-conn)
   1. You may also need to [enable the SQL Server browser service](https://www.godaddy.com/help/enable-the-sql-server-browser-service-19117)

##### Slack Setup
* Have a Slack Workspace for developing in ([*or create one here*][slack-create-workspace])
* Navigate to your [Slack API Apps][slack-manage-apps]
* Create a new App into your development workspace *(suggested name: "Egg Party Dev")*
* In Basic Information, save your Slack Signing Secret to `SlackSigningSecret` in `local.settings`
* Go to Bot Users and create a bot user
* Go to OAuth & Permissions, then Install App to Workspace and save your Bot User OAuth Token to `SlackApiToken` in `local.settings`

#### **Local Configuration Files**

```json
local.settings.json

{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "Environment": "Local",
        "SlackApiToken": "SLACK_BOT_OAUTH_TOKEN_HERE",
        "SlackSigningSecret": "SLACK_SIGNING_SECRET_HERE",
    }
}
```

```json
ormconfig.json

[
    {
        "name": "Local",
        "type": "mssql",
        "database": "EggParty",
        "entities": [
            "dist/db/entities/*.entity.js"
        ],
        "migrations": [
            "dist/db/migrations/*.js"
        ],
        "cli": {
            "migrationsDir": "src/db/migrations"
        },
        "logging": true,
        "host": "localhost",
        "username": "admin",
        "password": "password"
    }
]
```

### **Running & Debugging (VS Code)**
* Use the Debug window or the command `Debug: Start Debugging` *(Default: F5)* to run the app
    * *If prompted, choose "Launch Functions"*
* In a shell, run `ngrok http 7071 --host-header="localhost:7071"` to tunnel your local traffic to a URL that Slack can interact with
    * *This should show you a status page with a public URL*
* In your Slack App management page:
    * Go to Event Subscriptions and turn Events on
        * Add 2 Bot Event subscriptions (**_Not_ workspace events!**):
            * `message.channels`
            * `message.im`
        * For the Request URL, put `https://xxxxxxx.ngrok.io/api/slack-events`, where the ngrok subdomain is the one from the output of the command above
            * *Slack will send a Challenge request to this URL to verify that it's
                ready to handle events, so make sure the app is running or you won't
                be able to save the slack app*
    * Go to Interactive Components and turn Interactivity on
        * For the Request URL, put `https://xxxxxxx.ngrok.io/api/slack-interactions`

##### Note: You'll need to change the Events Request URL and Interactions Request URL every time you start a new ngrok session.

### **Helpful Links:**
* Making changes to the Guide Book? Use the [Guide Book Template][guide-book-template]

[sql-server-download]: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
[node-download]: https://nodejs.org/en/
[typeorm-install]: https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md
[func-install]: https://github.com/Azure/azure-functions-core-tools
[ngrok]: https://ngrok.com/

[sql-server-auth-mode]: https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/change-server-authentication-mode?view=sql-server-2017
[create-sql-admin]: https://www.godaddy.com/help/create-an-admin-user-for-microsoft-sql-server-19032

[slack-create-workspace]: https://slack.com/create
[slack-manage-apps]: https://api.slack.com/apps

[guide-book-template]: https://bit.ly/2NypQvF
