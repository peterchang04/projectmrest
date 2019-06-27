FROM node:8.11-alpine
MAINTAINER peter

# Ports
ENV PORT 51337
EXPOSE 51337

# Directories
ENV APP_DIR /app
WORKDIR $APP_DIR

# Environment Defaults - see cloud build trigger for values passed in
ARG env=
ARG port=
ARG twilioAccountSid=
ARG twilioAuthToken=
ARG mongoEndpoint=
ARG mongoDatabase=
ARG mongoUsername=
ARG mongoPassword=
ARG socketioRedisEndpoint=
ARG socketioRedisPort=
ARG socketioRedisPassword=
ARG revision_id=

# Environment Variables
ENV env=$env
ENV port=$port
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
