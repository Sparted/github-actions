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

Each param taken from the github action api should also take a equivalent from the env: `getInput('repo') || process.env.ACTION_REPO;`. That way we can launch the action localy without depending on an implicit context.

The actual function of the actions should be located in `src/actions/{action-name}/index.ts` and be tested there.

# How to create an action

- Create the action.yml in `./actions/{action-name}/action.yml` according. [Syntax is documented here](https://docs.github.com/ja/actions/creating-actions/about-custom-actions)
- Create entrypoint in `.src/entrypoint/{action-name}.ts` here you can get inputs from the environment variables or the github action api and validate them.
- Create the function for your action in `./src/actions/{your-action}/index.ts`, this function should depends only on its param for ease of testing.

And that's it ! The build script will pickup the new action in entrypoint.

# How to run locally
Find the environment variables needed in the entrypoint of the action you want to run and do `ACTION_REPO=Sparted/server ts-node ./src/entrypoints/{action-name}`, replace ACTION_REPO with what you need.

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

You should also set the neccessary secrets in the repositorys settings.