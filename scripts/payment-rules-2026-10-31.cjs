/**
 * Retours de Thierno du 31/10/2026 sur le paiement :
 *  - paiement en 1, 2 ou 3 fois ; la seule remise est celle du paiement en une fois (10 %),
 *    au premier achat (règle appliquée par le code, `lib/payment-rules.ts`) ;
 *  - « Centre de langue » (S2) et « Cours de langue » (S4) se confondaient : S4 seul reste ;
 *  - consultation : plus de remise de 5 %, les 25 € sont remboursés si un package suit.
 * Idempotent ; S2 est désactivé, pas supprimé.
 *
 *   node scripts/payment-rules-2026-10-31.cjs
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  for (const [key, value] of [['payment.discount_pct.2', '0'], ['payment.discount_pct.3', '0']]) {
    await prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  console.log('remises : 2× et 3× à 0 % (1× inchangé)');

  await prisma.pricedService.update({ where: { code: 'S2' }, data: { isActive: false } });
  await prisma.pricedService.update({ where: { code: 'S4' }, data: { name: 'Cours de langue : choix du centre et inscription' } });
  console.log('S2 désactivé, S4 renommé');

  const { count } = await prisma.package.updateMany({
    where: { slug: 'consultation' },
    data: {
      features: [
        'Analyse de votre projet avec un expert',
        'Rendez-vous à choisir parmi nos créneaux, affichés à votre heure',
        '25 € remboursés si vous prenez un package après la consultation',
      ],
    },
  });
  console.log(`consultation : ${count} fiche mise à jour`);
})()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
