FROM node:8.11-alpine
MAINTAINER peter

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

#ports
EXPOSE $port

# Copy package manager files
COPY package*.json ./
COPY yarn.lock ./

# Get Dependencies
RUN yarn install
RUN yarn global add nodemon

# Copy Current dir into image
COPY . $APP_DIR

# Copy Environment Variables to /.env
RUN sed -i "s|env=|env=$env |g" $APP_DIR/.env \
 && sed -i "s|port=|port=$port |g" $APP_DIR/.env \
 && sed -i "s|twilioAccountSid=|twilioAccountSid=$twilioAccountSid |g" $APP_DIR/.env \
 && sed -i "s|twilioAuthToken=|twilioAuthToken=$twilioAuthToken |g" $APP_DIR/.env \
 && sed -i "s|mongoEndpoint=|mongoEndpoint=$mongoEndpoint |g" $APP_DIR/.env \
 && sed -i "s|mongoDatabase=|mongoDatabase=$mongoDatabase |g" $APP_DIR/.env \
 && sed -i "s|mongoUsername=|mongoUsername=$mongoUsername |g" $APP_DIR/.env \
 && sed -i "s|mongoPassword=|mongoPassword=$mongoPassword |g" $APP_DIR/.env \
 && sed -i "s|socketioRedisEndpoint=|socketioRedisEndpoint=$socketioRedisEndpoint |g" $APP_DIR/.env \
 && sed -i "s|socketioRedisPort=|socketioRedisPort=$socketioRedisPort |g" $APP_DIR/.env \
 && sed -i "s|socketioRedisPassword=|socketioRedisPassword=$socketioRedisPassword |g" $APP_DIR/.env \
 && sed -i "s|revisionId=|revisionId=$revision_id |g" $APP_DIR/.env

# Healthcheck
ENV HEALTHCHECK_URI "http://127.0.0.1:${port}/v1/health"
HEALTHCHECK --interval=10s --timeout=15s --retries=3 --start-period=30s CMD node healthcheck.js

# Launch
CMD nodemon -L $APP_DIR/src/main.js
