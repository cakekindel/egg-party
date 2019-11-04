# Egg Party 🥚🎉

### Egg party is a Slack App for thanking teammates, raising chickens, and having a rowdy ol' time

---

#### Table of Contents
- [**Want to contribute?**](#want-to-contribute)
- [**Local Setup**](#local-setup)
    - [DB Setup](#db-setup-with-ms-sql)
- [**Local Configuration**](#local-configuration)
- [**Scripts**](#scripts)
- [**Slack Setup**](#slack-setup)
    - [**Slack App Settings**](#slack-app-settings)
    - [**Using your Local API with your Slack App**](#using-your-local-api-with-your-slack-app)
- [**Debugging**](#debugging)
    - [**Visual Studio Code**](#visual-studio-code)
- [**Common Errors**](#common-errors)
- [**Helpful Links**](#helpful-links)

---

### **Want to contribute?**

* **Read**: [Contributing Guidelines](CONTRIBUTING.md)
* **Install**: [SQL Server Express or Developer][sql-server-download]
* **Install**: [Node v10+][node-download]
    * *Optionally Install:* [TypeORM CLI][typeorm-install]

---

### **Local Setup**
1. Clone this repo
1. Run `npm install`
1. Create both of the [Local Config Files](#local-configuration-files)
1. Set up your local database:
    * Create a local database named `EggParty`
    * Ensure your local database has [SQL Server Auth][sql-server-auth-mode] and [TCP/IP][sql-enable-tcp] enabled.
    * [Create a local SQL admin][create-sql-admin] with the credentials in `ormconfig.json`
    * Run `npm run migrate` to initialize your schema

#### **Local Configuration**
`egg-party/.env`
```ahk
Environment="Local"
SlackApiToken="SLACK_BOT_OAUTH_TOKEN_HERE"
SlackSigningSecret="SLACK_SIGNING_SECRET_HERE"
```

`egg-party/ormconfig.json`
```json
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

---

### **Scripts**

|               Script | Description                                                                                             |
| -------------------: | ------------------------------------------------------------------------------------------------------- |
| `npm run serve`      | Run the API locally, and hot reload the app<br/> when you make typescript changes                       |
| `npm run test:watch` | Run all unit tests & re-run when you make typescript changes                                            |
| `npm run tunnel`     | Tunnel your local traffic to a public URL using `ngrok`.<br/>This is used to run locally against Slack. |

---

### **Slack Setup**

In order to run locally against Slack, you'll need a Workspace to test in,
and a Slack App to represent your local environment.

Don't have a Slack Workspace you can develop in? [Create one here][slack-create-workspace]!

In [your Slack Apps][slack-manage-apps], create a new app *e.g. "Egg Party Local"* and install it to your workspace.

#### Slack App Settings:

`Basic Information:` Save the value for "Signing Secret" to `SlackSigningSecret` in `.env`

`Bot Users:` Create a bot user

`OAuth & Permissions:`
  1. Use `Install App to Workspace`
  1. Save `Bot User OAuth Token` to `SlackApiToken` in `.env`

`Event Subscriptions:`
  1. Turn `Events` on
  1. `Request URL:` use `https://{{requestUrlBase}}/api/events` (see [Using your Local API](#using-your-local-api-with-your-slack-app))
  1. In "Subscribe to bot events", add the following event subscriptions:
      * `message.channels`
      * `message.im`

`Interactive Components`
  1. Turn `Interactivity` on
  1. For `Request URL` use `https://{{requestUrlBase}}/api/interactions` (see [Using your Local API](#using-your-local-api-with-your-slack-app))

#### Using your Local API with your Slack App

1. In a shell, run `npm run tunnel`
1. The URL printed by `ngrok` is the Request URL

---

### **Debugging**

#### Visual Studio Code

Run the command `Debug: Start Debugging` by pressing `F5`, by searching in the command palette (`F1`),
or from the Debug panel (`Ctrl/Cmd + Shift + D`)

### **Running Locally Against Slack**
* In a new shell window, use `npm run tunnel` to tunnel your local traffic to a URL that Slack can interact with
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

---

### **Common Errors**
* `Failed to connect to localhost:1433 - Could not connect (sequence)`
    * **Cause**: [TCP is not enabled][sql-enable-tcp] or
        the [SQL Server Browser Service][sql-enable-server-browser] is not running
        *(Related: [typeorm issue#2333][typeorm#2333])*

---

### **Helpful Links:**
* Making changes to the Guide Book? Use the [Guide Book Template][guide-book-template]!

<!-- Links -->

<!-- Downloads -->
[sql-server-download]: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
[node-download]: https://nodejs.org/en/
[typeorm-install]: https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md

[sql-server-auth-mode]: https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/change-server-authentication-mode?view=sql-server-2017
[create-sql-admin]: https://www.godaddy.com/help/create-an-admin-user-for-microsoft-sql-server-19032
[sql-enable-tcp]: https://www.habaneroconsulting.com/stories/insights/2015/tcpip-is-disabled-by-default-in-microsoft-sql-server-2014
[sql-enable-server-browser]: https://www.godaddy.com/help/enable-the-sql-server-browser-service-19117
[typeorm#2333]: https://github.com/typeorm/typeorm/issues/2133

[slack-create-workspace]: https://slack.com/create
[slack-manage-apps]: https://api.slack.com/apps

[guide-book-template]: https://bit.ly/2NypQvF
