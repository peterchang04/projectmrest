# Dev environment Setup
### install docker for windows
required windows 10 pro + hyperV enabled in bios
### share drive (via docker) to allow mapped volume to work
docker(windows tray right click) > Settings > Shared Drives > C (or whatever drive project is running on)
### allow for pushing to dockerhub repo
cmd.exe > docker login (1!d)
### allow access to google container registry
gcloud auth configure-docker (may have to install gcloud first, see below)
### install nodemon
yarn global add nodemon
### launching docker container
use bat file (from project dir, windows only)

# Environments
### local (dev) - for local development
### development (int) - for staging
### production (prod)

# Deployment Overview
1. push to development branch
2. Cloud Build Trigger "Stage Deploy on development merge" runs cloudbuild.yaml
  - builds project
  - pushes image to Google Container Registry (GCR) as [peterchang04/projectmrest/development]
  - asks kubernetes to update image
3. Kubernetes
  - distributes image to workflow

# Google Kubernetes Engine
see kube.yaml for w

# Google Cloud build
### Project: "projectmrest"
### local setup https://cloud.google.com/cloud-build/docs/quickstart-docker
login
gcloud config set project projectmrest
gcloud config set compute/zone us-east1-b
### build+pushing image
gcloud builds submit --tag gcr.io/projectm-212101/dev .

# Docker
### To build image (Dockerfile)
docker build -t gcr.io/projectmrest/local .
### To push image to gcr (tagged as latest)
docker push gcr.io/projectmrest/local
### To start container


# Redis
db projectm-redis
connection info stored @ cloudbuild trigger

# Redsmin (monitoring GUI)
https://app.redsmin.com/server/5b7769b49630d4fc0510f01d/finder/*
peter.chang.04@gmail.com ...te1!rm

# mocha - to test specific file
yarn mocha src/models/signal.test.js --exit
