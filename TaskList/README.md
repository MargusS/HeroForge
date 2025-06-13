# Task List Forge App

This project contains a Forge app written in JavaScript that shows issues from a selected Jira project in a global page. On this page, users can choose a project from a dropdown and the app lists tasks updated in the last 30 days.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.
The page appears in Jira's Apps menu under the name **Task List**.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.jsx` file.

- Modify your app backend by editing the `src/resolvers/index.js` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

- Build and deploy your app by running:
```
forge deploy
```

Make sure you run `npm install` in this directory before deploying so Forge can
resolve the required dependencies like `@forge/api`.

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Troubleshooting

If `forge deploy` fails with an error like `Can't resolve '@forge/resolver'` or
`Can't resolve '@forge/api'`, make sure that you ran `npm install` in this
directory. The bundler needs the packages in `node_modules` to build the app.

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
