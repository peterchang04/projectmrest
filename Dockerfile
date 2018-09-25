FROM node:8.11-alpine
MAINTAINER peter

# Ports
ENV PORT 51337
EXPOSE 51337

# Directories
ENV APP_DIR /app
WORKDIR $APP_DIR

# Environment Defaults - see build trigger for values passed in
ARG env=local
ARG twilioAccountSid=ACa92a64d720ce5ec43fa71482affe11f6
ARG twilioAuthToken=ea45bcbb77c7a8dc74deeb5797bb50d9
ARG mongoEndpoint=cluster0-isoin.gcp.mongodb.net
ARG mongoDatabase=test
ARG mongoUsername=app
ARG mongoPassword=lQD2ayo9imUuCaKH
ARG socketioRedisEndpoint=redis-14119.c1.us-central1-2.gce.cloud.redislabs.com
ARG socketioRedisPort=14119
ARG socketioRedisPassword=wM6js9sgfIhN6DsvphjoRCo4cnuS3I9E
ARG revision_id=unavailable

# Environment Variables
ENV env=$env
ENV twilioAccountSid=$twilioAccountSid
ENV twilioAuthToken=$twilioAuthToken
ENV mongoEndpoint=$mongoEndpoint
ENV mongoDatabase=$mongoDatabase
ENV mongoUsername=$mongoUsername
ENV mongoPassword=$mongoPassword
ENV socketioRedisEndpoint=$socketioRedisEndpoint
ENV socketioRedisPort=$socketioRedisPort
ENV socketioRedisPassword=$socketioRedisPassword
ENV revision_id=$revision_id

# Copy package manager files
COPY package*.json ./
COPY yarn.lock ./

# Get Dependencies
RUN yarn install
RUN yarn global add nodemon

# Healthcheck
ENV HEALTHCHECK_URI "http://127.0.0.1:${PORT}/v1/health"
HEALTHCHECK --interval=20s --timeout=30s --retries=15 CMD curl --fail ${HEALTHCHECK_URI} || exit 1

# Launch
CMD nodemon -L $APP_DIR/src/main.js
