# Development stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g bun

RUN bun install

# Copy source code
COPY . .

EXPOSE 8000

# Use nodemon for development
CMD ["bun", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install bun
RUN npm install -g bun

# Install production dependencies only
RUN bun install --production

# Copy built files from development stage
COPY --from=development /usr/src/app/dist ./dist

EXPOSE 8000

CMD ["bun", "run", "start"]
