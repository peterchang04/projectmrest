# NOTE: Complete projectm dev environment setup first

### Dev Environment setup
* run yarn in c:/projectmrest

### Google Cloud Infrastructure
* Cloud Build Trigger
  - name: projectm-rest-development
  - trigger type: branch
  - branch (regex): development
  - build configuration: cloud build configuration file
  - cloud build configuration file location: / cloudbuild.yaml
  - substitution variables
    - \_ENV: development
    - \_MONGO_DATABASE: in cloud
    - \_MONGO_ENDPOINT: in cloud
    - \_MONGO_PASSWORD: in cloud
    - \_MONGO_USERNAME: in cloud
    - \_PORT: 80
    - \_SOCKETIO_REDIS_ENDPOINT: in cloud
    - \_SOCKETIO_REDIS_PASSWORD: in cloud
    - \_SOCKETIO_REDIS_PORT: in cloud
    - \_TWILIO_ACCOUNT_SID: in cloud
    - \_TWILIO_AUTH_TOKEN: in cloud
* Load Balancer (projectm-rest-loadbalancer-dev)
  * Backend Service (projectm-rest-backendservice-dev)
    - protocol: HTTP
    - named port: http
    - timeout: 30s
    - backend type: instance groups
    - region: us-west2 (set automatically)
    * Backend
      - instance group: (projectm-rest-instancegroup-dev)
      - port numbers: 80
      - balancing mode: utilization
      - maximum cpu utilization: 80
      - capacity: 100
    - cloud CDN: NO
    * health check: (projectm-rest-lbhealthcheck-dev)
      - protocol: tcp
      - port: 80
      - proxy protocol: none
      - request:
      - response:
      - check interval: 10
      - timeout: 5
      - healthy threshold: 2
      - unhealthy threshold: 3
    - Session Affinity: none
    - connection draining timeout: 45
  * Frontend Service: (projectm-rest-frontendservice-dev)
    - protocol: HTTP
    - network service tier: standard
    - ip version: ipv4
    * IP Address: static 35.212.245.34 (projectm-rest-staticip-dev)
    - port: 80

* Managed Instance Group (projectm-rest-instancegroup-dev)
  - single zone
  - us-west1 (Oregon) us-west1-a
  * instance template: (initially set to none)
    - prjmr-itmp-dev-.... (from cloudbuild)
    - container: gcr.io/projectm-REST/development:$revision_id
  - autoscaling: on
  - autoscaling policy: cpu usage
  - target cpu usage: 75
  - minimum number of instances: 1
  - maximum number of instances: 2
  - cooldown period: 60
  * healthcheck (projectm-rest-ighealthcheck-dev)
    - protocol: TCP
    - port: 80
    - request:
    - response:
    - timeout: 5s
    - check interval: 10s
    - unhealthy threshold: 3 attempts
  - initial delay: 300

* VPC Network
  * Firewall Rule: projectm-rest-firewall-in-dev
    - logs: on
    - network: default
    - priority: 1000
    - direction: ingress
    - targets: specified target tags
    - target tags: http
    - source ip ranges: 0.0.0.0/0
    - protocols and ports: tcp:80

### Everything Below is OLD


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
docker build -t gcr.io/projectm-REST/local .
### To push image to gcr (tagged as latest)
docker push gcr.io/projectm-REST/local
### To start container
docker run -it -v %cd%:/app -p 51337:51337 gcr.io/projectm-REST/local:latest

# Redis
db projectm-redis
connection info stored @ cloudbuild trigger

# Redsmin (monitoring GUI) not currently hooked up
https://app.redsmin.com/server/5b7769b49630d4fc0510f01d/finder/*
peter.chang.04@gmail.com ...te1!rm

# mocha - to test specific file
yarn mocha src/models/signal.test.js --exit
