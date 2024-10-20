const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: "JavaScript",
        },
        // {
        //   name: "Python",
        // },
        // {
        //   name: "React",
        // },
        // {
        //   name: "TypeScript",
        // },
        // {
        //   name: "Angular",
        // },
        // {
        //   name: "Programming",
        // },
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
