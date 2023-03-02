const algoliasearch = require("algoliasearch");
const client = algoliasearch("22HUYWU131", "49b909f5dc8eddbb0080809afa2f0e4f");
const index = client.initIndex("posts");
const PrismaClient = require("@prisma/client");

const prisma = new PrismaClient.PrismaClient();
async function lmao() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },

      comments: true,
    },
  });

  const l = posts.map((a) => {
    return {
      ...a,
      objectID: a.id,
    };
  });
  index.saveObjects(l).wait();
}

lmao();
