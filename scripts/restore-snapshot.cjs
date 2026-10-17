/**
 * Restauration après l'incident du 17/10/2026 (base réinitialisée par erreur).
 *
 * Réécrit, à partir des instantanés pris sur l'API publique le matin même
 * (`../_rebuild/snapshot/*.json`), les données dont l'état final avait été corrigé
 * en admin et que les seeds ne reproduisent pas à l'identique :
 *   - study-countries : les 14 pays d'études publiés ;
 *   - universities    : les fiches et leurs filières, telles que servies en ligne.
 *
 * Strictement additif : upserts par clé naturelle, aucune suppression. Les écarts
 * restants (lignes en base absentes de l'instantané) sont seulement signalés.
 *   node scripts/restore-snapshot.cjs study-countries universities
 */
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SNAPSHOT = path.join(__dirname, '..', '..', '_rebuild', 'snapshot');
const load = name => require(path.join(SNAPSHOT, name)).data;

async function studyCountries() {
  const rows = load('sc.json');
  for (const r of rows) {
    const { id, createdAt, updatedAt, ...data } = r;
    await prisma.studyCountry.upsert({ where: { name: r.name }, update: data, create: data });
  }
  const others = await prisma.studyCountry.findMany({
    where: { name: { notIn: rows.map(r => r.name) } },
    select: { name: true, isValidated: true, studyAvailable: true },
  });
  console.log(`study countries : ${rows.length} restaurés`);
  if (others.length) console.log('  hors instantané (à revoir en admin) :', JSON.stringify(others));
}

async function universities() {
  const rows = load('unis.json');
  let programs = 0;
  const extras = [];
  for (const r of rows) {
    const { id, createdAt, programs: progs, ...data } = r;
    const uni = await prisma.university.upsert({ where: { name: r.name }, update: data, create: data });
    const wanted = new Set(progs.map(p => `${p.name}|${p.level}`));
    // Une seule requête par université : les filières déjà présentes sont ignorées.
    const created = await prisma.universityProgram.createMany({
      data: progs.map(p => ({ universityId: uni.id, name: p.name, level: p.level })),
      skipDuplicates: true,
    });
    programs += progs.length;
    if (process.env.VERBOSE) console.log(`  ${r.name} (+${created.count})`);
    const existing = await prisma.universityProgram.findMany({ where: { universityId: uni.id }, select: { name: true, level: true } });
    existing.filter(p => !wanted.has(`${p.name}|${p.level}`)).forEach(p => extras.push(`${r.name} : ${p.name} (${p.level})`));
  }
  const stray = await prisma.university.findMany({ where: { name: { notIn: rows.map(r => r.name) } }, select: { name: true } });
  console.log(`universities : ${rows.length} fiches, ${programs} filières`);
  if (stray.length) console.log('  fiches hors instantané :', stray.map(s => s.name).join(' ; '));
  if (extras.length) console.log(`  ${extras.length} filières hors instantané, ex. :`, extras.slice(0, 5).join(' | '));
}

const steps = { 'study-countries': studyCountries, universities };

(async () => {
  for (const name of process.argv.slice(2)) {
    if (!steps[name]) throw new Error(`étape inconnue : ${name}`);
    await steps[name]();
  }
})()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
