cd ../src/lotto-worker
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 176632549723.dkr.ecr.eu-central-1.amazonaws.com
docker build -t lucky-shiba-worker .
docker tag lucky-shiba-worker:latest 176632549723.dkr.ecr.eu-central-1.amazonaws.com/lucky-shiba-worker:latest
docker push 176632549723.dkr.ecr.eu-central-1.amazonaws.com/lucky-shiba-worker:latest