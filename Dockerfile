FROM node:latest
MAINTAINER peter

# Ports
ENV PORT 51337
EXPOSE 51337

# Directories
ENV APP_DIR /app
WORKDIR $APP_DIR

# Dependencies
RUN yarn
RUN yarn add restify
RUN yarn global add nodemon

# Healthcheck
ENV HEALTHCHECK_URI "http://127.0.0.1:${PORT}/v1/health"
HEALTHCHECK --interval=20s --timeout=30s --retries=15 CMD curl --fail ${HEALTHCHECK_URI} || exit 1

# Launch
CMD nodemon -L $APP_DIR/src/main
