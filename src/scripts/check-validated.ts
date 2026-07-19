import prisma from "../../lib/prisma";

async function main() {
  const sc = await prisma.studyCountry.groupBy({ by: ["isValidated"], _count: { _all: true } });
  const scSrc = await prisma.studyCountry.groupBy({ by: ["source"], _count: { _all: true } });
  const tc = await prisma.tourismCountry.groupBy({ by: ["isValidated"], _count: { _all: true } });
  const co = await prisma.country.groupBy({ by: ["isValidated"], _count: { _all: true } });
  const tp = await prisma.tourismProgram.groupBy({ by: ["isValidated"], _count: { _all: true } });
  console.log("StudyCountry by isValidated:", JSON.stringify(sc));
  console.log("StudyCountry by source:", JSON.stringify(scSrc));
  console.log("TourismCountry by isValidated:", JSON.stringify(tc));
  console.log("Country by isValidated:", JSON.stringify(co));
  console.log("TourismProgram by isValidated:", JSON.stringify(tp));
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
