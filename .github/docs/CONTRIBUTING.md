## Contributing
---

### Egg Party follows the [Conventional Commit Guidelines][conventional-commits].
Egg party is an early adopter of these guidelines in the spirit
    of maintaining consistent commit language and history.

The allowed commit types are:

```yaml
feat        # code change that introduces a new feature
fix         # code change that fixes a bug
refactor    # code change that does not introduce a feature or fix a bug
test        # code change to unit tests

build       # changes to build frameworks or external deps (i.e. npm, tsconfig, tslint)
ci          # changes to the CICD configuration

docs        # documentation changes
```

The allowed commit scopes are:
```yaml
api         # change to the API layer (controllers or services)
db          # change to the DB layer (schema or services)
guide-book  # change to the in-slack Guide Book
```

### Work should be tracked by [an issue][egg-party-issues] that has been triaged and prioritized in the To Do column of the [Egg Party Kanban Board][egg-party-board].

Create a feature branch for this issue and when you feel
    that it is code-complete, open a pull request
    to `master`.

Once your pull request is approved and ready to merge, hit
    `Squash and merge`.
    
### Before confirming the merge, change the merge commit like so:
- change commit title from "PR Title (#127)" to a Conventional Commit message
    - _The issue title should be a good starting point_
- change description to **_at least_** "`closes #issue-number`"

[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0-beta.4/
[egg-party-issues]: https://github.com/cakekindel/egg-party/issues
[egg-party-board]: https://github.com/cakekindel/egg-party/projects/1
