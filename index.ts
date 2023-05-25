import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;


const prisma = new PrismaClient()

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  while(true) {
    await sleep(1000)
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName()
      }
    })  
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
