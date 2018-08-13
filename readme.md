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

# Google Cloud build
### setup https://cloud.google.com/cloud-build/docs/quickstart-docker
login
gcloud config set project projectm-212101
### build+pushing image
gcloud builds submit --tag gcr.io/projectm-212101/dev .


# Docker
### To build image
docker build -t peterchang04/projectmrest
### To push image to dockerhub
docker push peterchang04/projectmrest
### To start container

# Production
