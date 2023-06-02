import { faker } from "@faker-js/faker";
import { PrismaClient as PrismaSalesClient } from "./prisma/generated/sales";
import { PrismaClient as PrismaUsersClient } from "./prisma/generated/users";

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

const salesClient1 = new PrismaSalesClient({
  datasources: { db: { url: process.env.DB1_URL_SALES } },
});
const salesClient2 = new PrismaSalesClient({
  datasources: { db: { url: process.env.DB2_URL_SALES } },
});
const usersClient1 = new PrismaUsersClient({
  datasources: { db: { url: process.env.DB1_URL_USERS }}
})
const usersClient2 = new PrismaUsersClient({
  datasources: { db: { url: process.env.DB2_URL_USERS }}
})

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  while (true) {
    await sleep(1000);
    await salesClient1.ventas.create({
      data: {
        fecha: faker.date.anytime(),
        finalizada: faker.number.float(),
        total: faker.number.float(),
        usuario_id: 1,
      },
    });
    await salesClient2.ventas.create({
      data: {
        fecha: faker.date.anytime(),
        finalizada: faker.number.float(),
        total: faker.number.float(),
        usuario_id: 1,
      },
    });
  }
}

main()
  .then(async () => {
    await salesClient1.$disconnect();
    await salesClient2.$disconnect();
    await usersClient1.$disconnect();
    await usersClient2.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await salesClient1.$disconnect();
    await salesClient2.$disconnect();
    await usersClient1.$disconnect();
    await usersClient2.$disconnect();
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
