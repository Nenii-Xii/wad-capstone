// File: src/repositories/subtask.repository.js
const prisma = require('../config/prisma');

const subtaskRepository = {
  async findAll(filters = {}) {
    return prisma.subtask.findMany({
      where: filters,
      include: {
        task: { select: { title: true } }
      }
    });
  },

  async findById(id) {
    return prisma.subtask.findUnique({
      where: { id: Number(id) }
    });
  },

  async create(data) {
    return prisma.subtask.create({ data });
  },

  async update(id, data) {
    return prisma.subtask.update({
      where: { id: Number(id) },
      data
    });
  },

  async remove(id) {
    return prisma.subtask.delete({
      where: { id: Number(id) }
    });
  }
};

module.exports = subtaskRepository;