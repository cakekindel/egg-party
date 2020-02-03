# Egg Party 🥚🎉

### Egg party is a Slack App for thanking teammates, raising chickens, and having a rowdy ol' time

---

![GitHub top language](https://img.shields.io/github/languages/top/cakekindel/egg-party)
[![Azure DevOps builds](https://img.shields.io/azure-devops/build/egg-party/466bd0c0-cb88-4264-9c33-42defabff549/4)](https://dev.azure.com/egg-party/egg-party-api/_build?definitionId=4)
[![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/egg-party/466bd0c0-cb88-4264-9c33-42defabff549/4)](https://dev.azure.com/egg-party/egg-party-api/_dashboards/dashboard/663d6429-94b5-48ec-b08c-829ef80489aa)
[![Greenkeeper badge](https://badges.greenkeeper.io/cakekindel/egg-party.svg)](https://greenkeeper.io/)


[![GitHub issues](https://img.shields.io/github/issues/cakekindel/egg-party?color=%2360bec4)](https://github.com/cakekindel/egg-party/issues)
[![Good First Issues](https://img.shields.io/github/labels/cakekindel/egg-party/tag%3Agood%20first%20issue)](https://github.com/cakekindel/egg-party/labels/tag%3Agood%20first%20issue)
[![Features](https://img.shields.io/github/labels/cakekindel/egg-party/type%3Afeature)](https://github.com/cakekindel/egg-party/labels/type%3Afeature)
[![Bugs](https://img.shields.io/github/labels/cakekindel/egg-party/type%3Abug)](https://github.com/cakekindel/egg-party/labels/type%3Abug)


[![CII Best Practices Tiered Percentage](https://img.shields.io/cii/percentage/3447)](https://bestpractices.coreinfrastructure.org/en/projects/3447)
![GitHub](https://img.shields.io/github/license/cakekindel/egg-party)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcakekindel%2Fegg-party.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcakekindel%2Fegg-party?ref=badge_shield)


### Table of Contents
---
- [**Want to contribute?**](#want-to-contribute)
- [**Local Setup**](#local-setup)
    - [**Local Configuration**](#local-configuration)
- [**Slack Setup**](#slack-setup)
    - [**Slack App Settings**](#slack-app-settings)
    - [**Using your Local API with your Slack App**](#using-your-local-api-with-your-slack-app)
- [**Scripts**](#scripts)
- [**Debugging**](#debugging)
    - [**Visual Studio Code**](#visual-studio-code)
- [**Common Errors**](#common-errors)
- [**Helpful Links**](#helpful-links)

<br/>

### **Want to contribute?**
---

* **Read**: [Contributing Guidelines](CONTRIBUTING.md)
* **Install**:
    - [SQL Server Express or Developer][sql-server-download]
    - [Node v10+][node-download]
    - [TypeORM CLI][typeorm-install]

<br/>

### **Setup**
---

1. Clone this repo
1. Run `npm install`
1. Create the [Local Configuration File](#local-configuration-files)
1. Set up your local database:
    * Create a local SQL database named `EggParty`
    * Ensure your local database has [SQL Server Auth][sql-server-auth-mode] and [TCP/IP][sql-enable-tcp] enabled.
    * [Create a local SQL admin][create-sql-admin] with the credentials in `ormconfig.json`
    * Run `npm run migration:run` to initialize your schema

#### **Local Configuration**
`.env` in project root:
```python
ENVIRONMENT="Local"

SLACK_CLIENT_ID=""     # CLIENT ID HERE
SLACK_CLIENT_SECRET="" # CLIENT SECRET HERE
SLACK_SIGNING_SECRET=""# SIGNING SECRET HERE

TYPEORM_CONNECTION="mssql"
TYPEORM_DATABASE="EggParty"
TYPEORM_ENTITIES="./dist/src/db/entities/*.entity.js"
TYPEORM_MIGRATIONS="./dist/src/db/migrations/*.js"
TYPEORM_HOST="localhost"
TYPEORM_USERNAME="admin"
TYPEORM_PASSWORD="password"
```
<br/>

### **Slack Setup**
---

**[Something out of date? Click here to report an issue!][report-issue]**

In order to run locally against Slack, you'll need:
- A Slack Workspace to test in (_[create one here][slack-create-workspace]_), and
- A Slack App (_[create one here][slack-manage-apps]_)

#### Slack App Setup
**[Something out of date? Click here to report an issue!][report-issue]**

1. You should be taken to a **Basic Information** view after creating your app.
1. Scroll down to the **App Credentials** view.
1. Copy these credentials to the `.env` you created earlier:
    - "Client ID" -> `SLACK_CLIENT_ID`
    - "Client Secret" -> `SLACK_CLIENT_SECRET`
    - "Signing Secret" -> `SLACK_SIGNING_SECRET`
1. From the **Features** sidebar, go to **Oauth & Permissions**.
1. For now, add a **Redirect URL** of `https://www.egg-party.com/api/v1/slack/oauth/redirect`.
1. Down in the **Scopes** view, add the following scopes:
    - `channels:history`
    - `reactions:read`
    - `im:history`
    - `im:write`
    - `chat:write`
1. From the **Features** sidebar, go to **Event Subscriptions**.
1. Turn **Events** on.
1. For now, put a **Request URL** of `https://www.egg-party.com/api/v1/slack/events`.
1. Down in the **Subscribe to Bot Events** view, add the following **Bot User Events**:
    - `message.channels`
    - `message.im`
    - `reaction_added`
1. From the **Features** sidebar, go to **Interactive Components**.
1. Turn **Interactivity** on.
1. For now, put a **Request URL** of `https://www.egg-party.com/api/v1/slack/interactions`.

#### Using your Local API with your Slack App
**[Something out of date? Click here to report an issue!][report-issue]**

1. In a shell, run `npm start` to run your local API.
1. In another shell, run `npm run tunnel` to tunnel your local traffic to a public URL.
1. The URL printed by `ngrok` is a URL that Slack can use to interact with your local environment.
1. From the **Features** sidebar, go to **Oauth & Permissions**.
1. Replace the Redirect URL you added earlier with `https://{{ngrokUrl}}/api/v1/slack/oauth/redirect`
1. From the **Features** sidebar, go to **Event Subscriptions**.
1. Replace the Request URL you put earlier with `https://{{ngrokUrl}}/api/v1/slack/events`
1. From the **Features** sidebar, go to **Interactive Components**.
1. Replace the Request URL you put earlier with `https://{{ngrokUrl}}/api/v1/slack/interactions`

<br/>

### **Scripts**
---

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
                <code>npm run test:single-run</code>
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
    <tr><th colspan="2">Style / Linting</th></tr>
    <tr>
        <td>
            <nobr><code>npm run style:fix</code></nobr>
        </td>
        <td>
            Formats your local codebase to the Google Typescript Style
        </td>
    </tr>
    <tr><th colspan="2">Database</th></tr>
    <tr>
        <td>
            <nobr><code>npm&nbsp;run&nbsp;migration:generate</code></nobr>
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

<br/>

### **Debugging**
---

#### Visual Studio Code

Run the command `Debug: Start Debugging` by pressing `F5`, by searching in the command palette (`F1`),
or from the Debug panel (`Ctrl/Cmd + Shift + D`)

<br/>

### **Common Errors**
---
* `Failed to connect to localhost:1433 - Could not connect (sequence)`
    * **Cause**: [TCP is not enabled][sql-enable-tcp] or
        the [SQL Server Browser Service][sql-enable-server-browser] is not running
        *(Related: [typeorm#2333][typeorm#2333])*

<br/>

### **Helpful Links:**
---
* Making changes to the Guide Book? Use the [Guide Book Template][guide-book-template]!

[report-issue]: https://github.com/cakekindel/egg-party/issues/new
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

[gts-url]: https://github.com/google/gts

[guide-book-template]: https://bit.ly/2NypQvF
