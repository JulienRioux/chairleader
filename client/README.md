# Solana POS monorepo

### Running locally

In the project directory, you can run:

```
yarn dev
```

### Offline support for S3 image upload

Currently, image upload are not working using `serverless-offline` (See https://github.com/dherault/serverless-offline/issues/464). Once deployed to AWS, it'll work as expected.


# Development workflow: 

- Pull the latest dev ⇒ `git pull origin dev`
- Create a new branch from dev ⇒ `DEVOPS-0-fixing-start-script`
- Push the change to the dev branch ⇒ `git push origin DEVOPS-0-fixing-start-script:dev`
- Merge the new branch into the `dev` branch.
- To promote to prod: Pull the latest dev and push to origin `git push origin HEAD`