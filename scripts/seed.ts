const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: "Business",
        },
        {
          name: "Computer Science",
        },
        {
          name: "Economics",
        },
        {
          name: "Mathematics",
        },
        {
          name: "Music",
        },
      ],
    });
    console.log("Categories created successfully.");
  } catch (error) {
    console.error(error);
  } finally {
    await database.$disconnect();
  }
}

main();
