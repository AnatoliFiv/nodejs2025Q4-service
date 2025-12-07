FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/ts-node ./node_modules/ts-node
COPY --from=builder /app/node_modules/tsconfig-paths ./node_modules/tsconfig-paths
COPY --from=builder /app/node_modules/typescript ./node_modules/typescript
COPY --from=builder /app/node_modules/@tsconfig ./node_modules/@tsconfig
COPY --from=builder /app/node_modules/json5 ./node_modules/json5

RUN test -f /app/node_modules/tsconfig-paths/register.js || (echo "ERROR: tsconfig-paths not found" && exit 1)

RUN npm cache clean --force && \
    rm -rf /tmp/* /var/tmp/* /root/.npm

COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist
COPY --chown=nestjs:nodejs --from=builder /app/src/migrations ./src/migrations
COPY --chown=nestjs:nodejs --from=builder /app/src/config ./src/config
COPY --chown=nestjs:nodejs --from=builder /app/src/users/entities ./src/users/entities
COPY --chown=nestjs:nodejs --from=builder /app/src/artists/entities ./src/artists/entities
COPY --chown=nestjs:nodejs --from=builder /app/src/albums/entities ./src/albums/entities
COPY --chown=nestjs:nodejs --from=builder /app/src/tracks/entities ./src/tracks/entities
COPY --chown=nestjs:nodejs --from=builder /app/src/favorites/entities ./src/favorites/entities
COPY --chown=nestjs:nodejs --from=builder \
    /app/tsconfig.json \
    /app/tsconfig.build.json \
    /app/nest-cli.json \
    /app/README.md \
    ./
COPY --chown=nestjs:nodejs --from=builder /app/doc ./doc

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]
