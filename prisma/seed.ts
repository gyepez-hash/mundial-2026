import { config } from "dotenv";
config();

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

async function createPrisma() {
  const { PrismaClient } = await import("../src/generated/prisma/client.js");
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

let prisma: Awaited<ReturnType<typeof createPrisma>>;

async function main() {
  prisma = await createPrisma();

  const teams = [
    { name: "Morocco", code: "MAR", group: "A" },
    { name: "Peru", code: "PER", group: "A" },
    { name: "Scotland", code: "SCO", group: "A" },
    { name: "TBD A4", code: "A4", group: "A" },
    { name: "Spain", code: "ESP", group: "B" },
    { name: "Turkey", code: "TUR", group: "B" },
    { name: "Ecuador", code: "ECU", group: "B" },
    { name: "TBD B4", code: "B4", group: "B" },
    { name: "Mexico", code: "MEX", group: "C" },
    { name: "Belgium", code: "BEL", group: "C" },
    { name: "TBD C3", code: "C3", group: "C" },
    { name: "TBD C4", code: "C4", group: "C" },
    { name: "France", code: "FRA", group: "D" },
    { name: "Colombia", code: "COL", group: "D" },
    { name: "Saudi Arabia", code: "KSA", group: "D" },
    { name: "TBD D4", code: "D4", group: "D" },
    { name: "USA", code: "USA", group: "E" },
    { name: "England", code: "ENG", group: "E" },
    { name: "TBD E3", code: "E3", group: "E" },
    { name: "TBD E4", code: "E4", group: "E" },
    { name: "Brazil", code: "BRA", group: "F" },
    { name: "Netherlands", code: "NED", group: "F" },
    { name: "TBD F3", code: "F3", group: "F" },
    { name: "TBD F4", code: "F4", group: "F" },
    { name: "Portugal", code: "POR", group: "G" },
    { name: "Uruguay", code: "URU", group: "G" },
    { name: "TBD G3", code: "G3", group: "G" },
    { name: "TBD G4", code: "G4", group: "G" },
    { name: "Germany", code: "GER", group: "H" },
    { name: "Serbia", code: "SRB", group: "H" },
    { name: "Chile", code: "CHI", group: "H" },
    { name: "TBD H4", code: "H4", group: "H" },
    { name: "Argentina", code: "ARG", group: "I" },
    { name: "Japan", code: "JPN", group: "I" },
    { name: "TBD I3", code: "I3", group: "I" },
    { name: "TBD I4", code: "I4", group: "I" },
    { name: "Canada", code: "CAN", group: "J" },
    { name: "Australia", code: "AUS", group: "J" },
    { name: "TBD J3", code: "J3", group: "J" },
    { name: "TBD J4", code: "J4", group: "J" },
    { name: "South Korea", code: "KOR", group: "K" },
    { name: "Iran", code: "IRN", group: "K" },
    { name: "TBD K3", code: "K3", group: "K" },
    { name: "TBD K4", code: "K4", group: "K" },
    { name: "Denmark", code: "DEN", group: "L" },
    { name: "Senegal", code: "SEN", group: "L" },
    { name: "TBD L3", code: "L3", group: "L" },
    { name: "TBD L4", code: "L4", group: "L" },
  ];

  console.log("Seeding database...");

  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.scoringConfig.deleteMany();

  const createdTeams: Record<string, string> = {};
  for (const team of teams) {
    const created = await prisma.team.create({ data: team });
    createdTeams[team.code] = created.id;
  }
  console.log(`Created ${teams.length} teams`);

  await prisma.scoringConfig.create({
    data: { exactScore: 5, correctWinner: 3, correctDraw: 2 },
  });

  const venues = [
    "MetLife Stadium, New Jersey",
    "SoFi Stadium, Los Angeles",
    "AT&T Stadium, Dallas",
    "Hard Rock Stadium, Miami",
    "Lumen Field, Seattle",
    "Estadio Azteca, Mexico City",
    "NRG Stadium, Houston",
    "Mercedes-Benz Stadium, Atlanta",
    "Lincoln Financial Field, Philadelphia",
    "BMO Field, Toronto",
    "BC Place, Vancouver",
    "Estadio BBVA, Monterrey",
    "Arrowhead Stadium, Kansas City",
    "Levi's Stadium, San Francisco",
    "Gillette Stadium, Boston",
    "Guadalajara Stadium, Guadalajara",
  ];

  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const baseDate = new Date("2026-06-11T00:00:00Z");
  let matchNumber = 1;

  // Group stage matches
  for (let i = 0; i < groups.length; i++) {
    const groupTeams = teams.filter((t) => t.group === groups[i]);
    const pairings = [
      [0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2],
    ];

    for (let j = 0; j < pairings.length; j++) {
      const matchDate = new Date(baseDate);
      matchDate.setDate(matchDate.getDate() + Math.floor(i / 2) + Math.floor(j / 2));
      matchDate.setHours(12 + (j % 3) * 3, 0, 0, 0);

      await prisma.match.create({
        data: {
          matchNumber: matchNumber++,
          stage: "group",
          group: groups[i],
          homeTeamId: createdTeams[groupTeams[pairings[j][0]].code],
          awayTeamId: createdTeams[groupTeams[pairings[j][1]].code],
          dateTime: matchDate,
          venue: venues[(i + j) % venues.length],
        },
      });
    }
  }
  console.log(`Created ${matchNumber - 1} group matches`);

  // Knockout stage
  const knockoutStages = [
    { stage: "round32", count: 16, daysAfter: 18 },
    { stage: "round16", count: 8, daysAfter: 22 },
    { stage: "quarter", count: 4, daysAfter: 26 },
    { stage: "semi", count: 2, daysAfter: 30 },
    { stage: "third", count: 1, daysAfter: 33 },
    { stage: "final", count: 1, daysAfter: 34 },
  ];

  for (const ko of knockoutStages) {
    for (let j = 0; j < ko.count; j++) {
      const koDate = new Date(baseDate);
      koDate.setDate(koDate.getDate() + ko.daysAfter + Math.floor(j / 2));
      koDate.setHours(13 + (j % 2) * 4, 0, 0, 0);

      await prisma.match.create({
        data: {
          matchNumber: matchNumber++,
          stage: ko.stage,
          group: null,
          homeTeamId: null,
          awayTeamId: null,
          dateTime: koDate,
          venue: venues[j % venues.length],
        },
      });
    }
  }

  console.log(`Total: ${matchNumber - 1} matches created`);
  console.log("Seed completed!");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
