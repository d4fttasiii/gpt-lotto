cd ../src/lotto-app
npm ci
npm run build
aws s3 sync ./build s3://lucky-shiba-web3