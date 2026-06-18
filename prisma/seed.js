const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Mulai seeding database MySQL...');

  // Hapus data lama — urutan PENTING karena foreign key constraint!
  await prisma.subtask.deleteMany(); // <-- Hapus subtask dulu biar gak bentrok
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // —— Buat Categories ——————————————————————————————————————
  const [catBelajar, catKerja, catProyek] = await Promise.all([
    prisma.category.create({ data: { name: 'Belajar', color: '#6366F1' } }),
    prisma.category.create({ data: { name: 'Pekerjaan', color: '#F59E0B' } }),
    prisma.category.create({ data: { name: 'Proyek', color: '#10B981' } }),
  ]);
  console.log(' ✓ 3 kategori dibuat');

  // —— Buat Users ———————————————————————————————————————————
  const [budi, siti] = await Promise.all([
    prisma.user.create({ data: { name: 'Budi Santoso', email: 'budi@example.com', password: 'hashed_later' } }),
    prisma.user.create({ data: { name: 'Siti Rahayu', email: 'siti@example.com', password: 'hashed_later' } }),
  ]);
  console.log(' ✓ 2 user dibuat');

  // —— Buat Tasks ———————————————————————————————————————————
  // Kita tampung hasilnya ke variabel untuk diambil ID-nya sebagai parentTaskId
  const tasks = await Promise.all([
    prisma.task.create({ data: { title: 'Setup Express server', status: 'DONE', priority: 'HIGH', userId: budi.id, categoryId: catProyek.id } }),
    prisma.task.create({ data: { title: 'Belajar REST API', status: 'DONE', priority: 'HIGH', userId: budi.id, categoryId: catBelajar.id } }),
    prisma.task.create({ data: { title: 'Setup MySQL + XAMPP', status: 'IN_PROGRESS', priority: 'HIGH', userId: budi.id, categoryId: catProyek.id, description: 'Menggunakan Prisma ORM' } }),
    prisma.task.create({ data: { title: 'Belajar Prisma ORM', status: 'TODO', priority: 'MEDIUM', userId: budi.id, categoryId: catBelajar.id } }),
    prisma.task.create({ data: { title: 'Review laporan bulanan', status: 'TODO', priority: 'LOW', userId: siti.id, categoryId: catKerja.id } }),
    prisma.task.create({ data: { title: 'Meeting tim desain', status: 'TODO', priority: 'MEDIUM', userId: siti.id, categoryId: catKerja.id } }),
  ]);
  console.log(' ✓ 6 task dibuat');

  // Ambil ID dari task pertama ('Setup Express server') sebagai induk subtask
  const parentId = tasks[0].id;

  // —— Buat 5 Subtasks Spesifik Praktikum Neni —————————————————
  await prisma.subtask.createMany({
    data: [
      { title: 'Install Express generator', parentTaskId: parentId, userId: budi.id, isCompleted: true },
      { title: 'Setup variabel environment .env', parentTaskId: parentId, userId: budi.id, isCompleted: true },
      { title: 'Konfigurasi Prisma client driver', parentTaskId: parentId, userId: budi.id, isCompleted: false },
      { title: 'Buat struktur middleware JWT', parentTaskId: parentId, userId: budi.id, isCompleted: false },
      { title: 'Uji coba via Postman collection', parentTaskId: parentId, userId: budi.id, isCompleted: false },
    ],
  });
  console.log(' ✓ 5 subtask praktikum berhasil dibuat');

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });