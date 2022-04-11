A place for our github actions.

# How to release
Everything is done via the `yarn release` script. It does the following:

1. Run tests
2. Run the build step
3. Ask you about the new version
4. Tags it (`v1.0.0`)
5. Push the tags, the version and the new build

# Folder structure
Actions entrypoints are in `src/entrypoints/{action-name}.ts` and should be unique per action. Each file will be treated a an entrypoint to an action by the build script.

Those file should only get and validate params from the env/github action api and pass them to a function. This is to test as much as possible of the action logic.

The actual function of the actions should be located in `src/actions/{action-name}/index.ts` and be tested there.

# How to use actions
You can check the .github/workflows folder for information about using actions
```yml
  name: Update tasks to accepted on release
  on:
    workflow_dispatch:
    release:
      branches:
        - master
        - main
  jobs:
    update_clickup_tasks:
      runs-on: ubuntu-latest
      name: Updates tasks added in the changelog to accepted
      steps:
        - name: Checkout
          uses: actions/checkout@v2
        - name: Launch clickup tast release action
          uses: Sparted/github-actions/actions/clickup-task-release@v1.0.0
          with:
            clickup-token: ${{ secrets.ACTION_CLICKUP_TOKEN }}
```
You should always set the latest tag after the action name in the `uses` clause