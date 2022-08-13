# Download the slim version of node
FROM node:16

# Set the work directory to app folder. 
# We will be copying our code here
WORKDIR /node

#Copy package.json file in the node folder inside container
COPY package.json .

# Install the dependencies in the container
RUN npm install

# Copy the rest of the code in the container
COPY . .

# Run the node server with server.js file
CMD ["npm", "run", "dev"]

# Expose the service over PORT 3000
EXPOSE 7000