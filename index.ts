import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

const client1 = new PrismaClient({
  datasources: { db: { url: process.env.DB1_URL } },
});
const client2 = new PrismaClient({
  datasources: { db: { url: process.env.DB2_URL } },
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  while (true) {
    await sleep(1000);
    await client1.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
      },
    });
    await client2.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
      },
    });
  }
}

main()
  .then(async () => {
    await client1.$disconnect();
    await client2.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client1.$disconnect();
    await client2.$disconnect();
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
