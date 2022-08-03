# Solana POS monorepo

### Running locally

In the project directory, you can run:

```
yarn dev
```

### Offline support for S3 image upload

Currently, image upload are not working using `serverless-offline` (See https://github.com/dherault/serverless-offline/issues/464). Once deployed to AWS, it'll work as expected.