// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/lib/prisma"; // Adjust based on your Prisma setup

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { search, page = 1 } = req.query;
//   const pageSize = 12;

//   // Example: Replace this with your actual user validation logic
//   const user = await validateRequest(req);
//   if (!user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const books = await prisma.book.findMany({
//       where: {
//         userId: user.id,
//         OR: search
//           ? [
//               { title: { contains: search as string, mode: "insensitive" } },
//               { author: { contains: search as string, mode: "insensitive" } },
//               { description: { contains: search as string, mode: "insensitive" } },
//             ]
//           : undefined,
//       },
//       skip: (Number(page) - 1) * pageSize,
//       take: pageSize,
//       orderBy: { createdAt: "desc" },
//     });

//     res.status(200).json({ books });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch books" });
//   }
// }
