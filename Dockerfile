FROM node:11-alpine

# Install git for jest watcher for virus scanning
RUN apk add --update --no-cache git python make g++

# Change the working directory to the source files
WORKDIR /usr/src

# Set the entrypoint to yarn script runner
ENTRYPOINT ["yarn","run"]

# Execute the ci task by default
CMD ["ci"]

