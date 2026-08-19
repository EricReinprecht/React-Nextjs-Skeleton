# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g npm@latest
WORKDIR /app

# ---- Dev stage ----
FROM base AS dev
# Copy configuration files first to optimize Docker layer caching
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- Prod stage ----
FROM base AS prod
COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_DEFAULT_LATITUDE
ARG NEXT_PUBLIC_DEFAULT_LONGITUDE
ARG NEXT_PUBLIC_PARTY_PAGE_SIZE
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID

ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_DEFAULT_LATITUDE=$NEXT_PUBLIC_DEFAULT_LATITUDE \
    NEXT_PUBLIC_DEFAULT_LONGITUDE=$NEXT_PUBLIC_DEFAULT_LONGITUDE \
    NEXT_PUBLIC_PARTY_PAGE_SIZE=$NEXT_PUBLIC_PARTY_PAGE_SIZE \
    NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID

RUN --mount=type=secret,id=env_local,required=false \
    if [ -f /run/secrets/env_local ]; then set -a; . /run/secrets/env_local; set +a; fi && \
    npm run prisma:generate && npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]