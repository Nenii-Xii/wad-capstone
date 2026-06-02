let tasks = [
  { 
    id: 1, 
    title: 'Setup project', 
    status: 'done', 
    priority: 'high', 
    createdAt: new Date('2024-01-10').toISOString(), 
    updatedAt: new Date('2024-01-10').toISOString() 
  },
  { 
    id: 2, 
    title: 'Belajar Express', 
    status: 'in_progress', 
    priority: 'high', 
    createdAt: new Date('2024-01-11').toISOString(), 
    updatedAt: new Date('2024-01-11').toISOString() 
  },
  { 
    id: 3, 
    title: 'Desain REST API', 
    status: 'todo', 
    priority: 'medium', 
    createdAt: new Date('2024-01-12').toISOString(), 
    updatedAt: new Date('2024-01-12').toISOString() 
  },
  { 
    id: 4, 
    title: 'Setup PostgreSQL', 
    status: 'todo', 
    priority: 'medium', 
    createdAt: new Date('2024-01-13').toISOString(), 
    updatedAt: new Date('2024-01-13').toISOString() 
  },
  { 
    id: 5, 
    title: 'Belajar GraphQL', 
    status: 'todo', 
    priority: 'low', 
    createdAt: new Date('2024-01-14').toISOString(), 
    updatedAt: new Date('2024-01-14').toISOString() 
  }
];

let nextId = 6; // Sistem Auto-increment sederhana

const store = {
  // 1. AMBIL SEMUA DATA (Dilengkapi Fungsi Filtering, Sorting, dan Pagination!)
  findAll({ status, priority, sort = "createdAt", order = "desc", limit = 10, offset = 0 } = {}) {
    let result = [...tasks];

    // FILTERING (Penyaringan)
    if (status) result = result.filter(t => t.status === status);
    if (priority) result = result.filter(t => t.priority === priority);

    // SORTING (Pengurutan)
    result.sort((a, b) => {
      const valA = a[sort] || '';
      const valB = b[sort] || '';
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return order === 'asc' ? cmp : -cmp;
    });

    // PAGINATION (Pemotongan Halaman memakai Limit & Offset yang kita bahas tadi!)
    const total = result.length;
    const data = result.slice(Number(offset), Number(offset) + Number(limit));

    return { data, total };
  },

  // 2. CARI SATU DATA BERDASARKAN ID
  findById(id) {
    return tasks.find(t => t.id === Number(id)) || null;
  },

  // 3. BUAT DATA BARU (POST)
  create(payload) {
    const now = new Date().toISOString();
    const task = { id: nextId++, ...payload, createdAt: now, updatedAt: now };
    tasks.push(task);
    return task;
  },

  // 4. GANTI SELURUH DATA (PUT)
  replace(id, payload) {
    const idx = tasks.findIndex(t => t.id === Number(id));
    if (idx === -1) return null;
    const now = new Date().toISOString();
    tasks[idx] = { id: Number(id), ...payload, createdAt: tasks[idx].createdAt, updatedAt: now };
    return tasks[idx];
  },

  // 5. PERBARUI SEBAGIAN DATA (PATCH)
  update(id, payload) {
    const idx = tasks.findIndex(t => t.id === Number(id));
    if (idx === -1) return null;
    const now = new Date().toISOString();
    tasks[idx] = { ...tasks[idx], ...payload, updatedAt: now };
    return tasks[idx];
  },

  // 6. HAPUS DATA (DELETE)
  remove(id) {
    const idx = tasks.findIndex(t => t.id === Number(id));
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    return true;
  }
};

module.exports = store;