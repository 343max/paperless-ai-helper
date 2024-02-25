FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lockb /app/
RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "start"]