A place for our github actions.

# How to release
Everything is done via the `yarn release` script. It does the following:

1. Run tests
2. Run the build step
3. Ask you about the new version
4. Tag it (`v1.0.0`)
5. Push the tags, the version and the new build

# Folder structure
Actions entrypoints are in `src/entrypoints/{action-name}.ts` and should be unique per action. Each file will be treated a an entrypoint to an action by the build script.

Those file should only get and validate params from the env/github action api and pass them to a function. This is to test as much as possible of the action logic.

The actual function of the actions should be located in `src/actions/{action-name}/index.ts` and be tested there.

# How to create an action

- Create the action.yml in `./actions/{action-name}/action.yml` according. [Syntax is documented here](https://docs.github.com/actions/creating-actions/about-custom-actions)
- Create entrypoint in `./src/entrypoint/{action-name}.ts` here you can get inputs from the environment variables or the github action api and validate them.
- Create the function for your action in `./src/actions/{your-action}/index.ts`, this function should depends only on its param for ease of testing.

And that's it ! The build script will pickup the new action in entrypoint.

# How to run locally
Find the environment variables needed in the entrypoint of the action you want to run and do `INPUT_REPO=Sparted/server ts-node ./src/entrypoints/{action-name}`, replace REPO with what you need. [See documentation here](https://github.com/actions/toolkit/blob/main/docs/github-package.md#mocking-inputs)

# How to use actions
You can check the workflow-template folder for information about using actions

You should always set the latest tag after the action name in the `uses` clause

You should also set the necessary secrets in the repositorys settings.
