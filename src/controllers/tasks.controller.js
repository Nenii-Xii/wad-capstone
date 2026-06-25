const taskRepo = require("../repositories/task.repository");

// —— CREATE TASK ————————————————————————————————————————————————
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, categoryId } = req.body;
    const userId = req.user.userId;

    const task = await taskRepo.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId,
      categoryId: categoryId || null,
    });

    // —— EMIT REAL-TIME EVENT
    const io = req.app.get("io");
    if (io) {
      // Kirim ke semua user yang terhubung (room global)
      io.to("tasks:global").emit("task:created", { task });
      // Kirim notifikasi personal ke pembuat task
      io.to(`user:${userId}`).emit("notification", {
        type: "SUCCESS",
        title: "Task Berhasil Dibuat",
        message: `Task "${task.title}" telah ditambahkan.`,
      });
    }

    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
};

// —— UPDATE TASK ————————————————————————————————————————————————
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await taskRepo.update(parseInt(id), {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    const io = req.app.get("io");
    if (io) {
      io.to("tasks:global").emit("task:updated", { task });
    }

    res.json({ data: task });
  } catch (err) {
    next(err);
  }
};

// —— DELETE TASK ————————————————————————————————————————————————
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    await taskRepo.remove(parseInt(id));

    const io = req.app.get("io");
    if (io) {
      io.to("tasks:global").emit("task:deleted", { taskId: parseInt(id) });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, updateTask, deleteTask };