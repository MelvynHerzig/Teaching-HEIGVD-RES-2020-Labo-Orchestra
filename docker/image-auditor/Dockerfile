FROM node:14.17

WORKDIR /opt/app/
RUN npm install moment

# Copy the app in the file system
COPY src /opt/app/

ENTRYPOINT  ["node", "/opt/app/auditor.js"]