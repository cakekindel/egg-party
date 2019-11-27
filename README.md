# Egg Party 🥚🎉

### Egg party is a Slack App for thanking teammates, raising chickens, and having a rowdy ol' time

---
[![Build Status](https://dev.azure.com/egg-party/egg-party-api/_apis/build/status/Egg%20Party%20CI%20Checks?branchName=master)](https://dev.azure.com/egg-party/egg-party-api/_build/latest?definitionId=4&branchName=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/cakekindel/egg-party.svg)](https://greenkeeper.io/)

---

#### Table of Contents
- [**Want to contribute?**](#want-to-contribute)
- [**Local Setup**](#local-setup)
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
    * Run `npm run migration:run` to initialize your schema

#### **Local Configuration**
`egg-party/.env`
```ahk
ENVIRONMENT="Local"

SLACK_APITOKEN="Api_Token_Here"
SLACK_SIGNINGSECRET="Signing_Secret_Here"

TYPEORM_CONNECTION="mssql"
TYPEORM_DATABASE="EggParty"
TYPEORM_ENTITIES="./dist/src/db/entities/*.entity.js"
TYPEORM_MIGRATIONS="./dist/src/db/migrations/*.js"
TYPEORM_HOST="localhost"
TYPEORM_USERNAME="admin"
TYPEORM_PASSWORD="password"
```

---

### **Scripts**

<table>
    <tr></tr>
    <tr><th colspan="2">Running</th></tr>
    <tr>
        <td>
            <nobr>
                <code>npm start</code><br/>
                <code>npm run serve</code>
            </nobr>
        </td>
        <td>
            Run the API locally, hot reload when you make typescript changes
        </td>
    </tr>
    <tr><th colspan="2">Testing</th></tr>
    <tr>
        <td>
            <nobr>
                <code>npm test</code><br/>
                <code>npm run test:single&#x2011;run</code>
            </nobr>
        </td>
        <td>
            Build & run all unit tests
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <nobr><code>npm run test:watch</code></nobr>
        </td>
        <td>
            Run all unit tests & re-run when you make changes
        </td>
    </tr>
    <tr><th colspan="2">Utilities</th></tr>
    <tr>
        <td>
            <nobr><code>npm run tunnel</code></nobr>
        </td>
        <td>
            Tunnel your local traffic to a public URL using `ngrok`.<br/>
            Use this to run locally against Slack.
        </td>
    </tr>
    <tr><th colspan="2">Database</th></tr>
    <tr>
        <td>
            <nobr><code>npm run migration:generate</code></nobr>
        </td>
        <td>
            Generate a TypeORM migration file based on changes made to entities since the last migration was made<br/><br/>
            Usage note: you must pass the migration script a name for the migration<br/>
            e.g. <code>npm run migration:generate -- -n AddCreatedDateColumn</code>
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <nobr><code>npm run migration:run</code></nobr>
        </td>
        <td>
            Runs migrations against the database specified in <code>.env</code>
        </td>
    </tr>
</table>

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
  1. `Request URL:` use `https://{{requestUrlBase}}/api/v1/slack/events` (see [Using your Local API](#using-your-local-api-with-your-slack-app))
  1. `Subscribe to bot events:` add the following event subscriptions:
      * `message.channels`
      * `message.im`

`Interactive Components`
  1. Turn `Interactivity` on
  1. For `Request URL` use `https://{{requestUrlBase}}/api/v1/slack/interactions` (see [Using your Local API](#using-your-local-api-with-your-slack-app))

#### Using your Local API with your Slack App

1. In a shell, run `npm run tunnel`
1. The URL printed by `ngrok` is the Request URL

---

### **Debugging**

#### Visual Studio Code

Run the command `Debug: Start Debugging` by pressing `F5`, by searching in the command palette (`F1`),
or from the Debug panel (`Ctrl/Cmd + Shift + D`)

---

### **Common Errors**
* `Failed to connect to localhost:1433 - Could not connect (sequence)`
    * **Cause**: [TCP is not enabled][sql-enable-tcp] or
        the [SQL Server Browser Service][sql-enable-server-browser] is not running
        *(Related: [typeorm#2333][typeorm#2333])*

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
