const Joi = require('joi');

const createSubtaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required()
    .messages({
      'string.min': 'Judul subtask minimal harus 3 karakter.',
      'any.required': 'Judul subtask wajib diisi.'
    }),
  parentTaskId: Joi.number().integer().required()
    .messages({ 'any.required': 'parentTaskId wajib disertakan.' }),
  isCompleted: Joi.boolean().optional()
});

const updateSubtaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),
  isCompleted: Joi.boolean().optional()
});

module.exports = { createSubtaskSchema, updateSubtaskSchema };