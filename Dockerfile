FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
# The repository lockfile currently lags behind package.json, so refresh it in-image.
RUN npm install

COPY . .

ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_DEFAULT_LATITUDE
ARG NEXT_PUBLIC_DEFAULT_LONGITUDE
ARG NEXT_PUBLIC_PARTY_PAGE_SIZE

ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_DEFAULT_LATITUDE=$NEXT_PUBLIC_DEFAULT_LATITUDE \
    NEXT_PUBLIC_DEFAULT_LONGITUDE=$NEXT_PUBLIC_DEFAULT_LONGITUDE \
    NEXT_PUBLIC_PARTY_PAGE_SIZE=$NEXT_PUBLIC_PARTY_PAGE_SIZE

# `.env.local` is excluded from the image. Mount it only while building so
# Next.js can inline browser-safe NEXT_PUBLIC values such as the PayPal ID.
RUN --mount=type=secret,id=env_local,required=false \
    if [ -f /run/secrets/env_local ]; then set -a; . /run/secrets/env_local; set +a; fi && \
    npm run prisma:generate && npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
