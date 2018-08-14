# Dev environment Setup
### install docker for windows
required windows 10 pro + hyperV enabled in bios
### share drive (via docker) to allow mapped volume to work
docker(windows tray right click) > Settings > Shared Drives > C (or whatever drive project is running on)
### allow for pushing to dockerhub repo
cmd.exe > docker login
### install nodemon
yarn global add nodemon
### launching docker container
use bat file (from project dir, windows only)

# Environments
### development (dev) - for local development
### integration (int) - for staging
### production (prod)

# Deployment
1. push to development branch
2. Cloud Build Trigger "Stage Deploy on development merge" runs cloudbuild.yaml
  - builds project
  - updates image on Google Container Registry (GCR)
  - pushes image
  - asks kubernetes to update image
3. Kubernetes
  - distributes image to setup

# Google Cloud build
### Project: "projectmrest"
### local setup https://cloud.google.com/cloud-build/docs/quickstart-docker
login
gcloud config set project projectmrest
gcloud config set compute/zone us-east1-b
### build+pushing image
gcloud builds submit --tag gcr.io/projectm-212101/dev .
### kubernetes
gcloud container clusters create projectmrest-kube-dev

# Docker
### To build image
docker build -t peterchang04/projectmrest .
### To push image to dockerhub
docker push peterchang04/projectmrest
### To start container

# Production
