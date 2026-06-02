// File: src/docs/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: config.appName,
      version: config.version,
      description: 'REST API untuk capstone project Web Advanced Development.',
    },
    servers: [
      { 
        url: `http://localhost:${config.port}`, 
        description: 'Local Dev' 
      }
    ],
    components: {
      schemas: {
        CreateTask: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200, example: 'Belajar Joi Validation' },
            description: { type: 'string', maxLength: 1000, example: 'Mempelajari cara validasi input dengan Joi' },
            status: { type: 'string', enum: ['todo', 'in_progress', 'done'], default: 'todo' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
            dueDate: { type: 'string', format: 'date-time', example: '2024-12-31T00:00:00Z' },
          },
        },
        Task: {
          allOf: [
            { '$ref': '#/components/schemas/CreateTask' },
            { 
              type: 'object', 
              properties: {
                id: { type: 'integer', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              }
            },
          ],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Data yang dikirim tidak valid.' },
                details: { 
                  type: 'array', 
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  }
                },
              },
            },
          },
        },
      },
    },
    // Menulis dokumentasi rute langsung di sini agar aman dari eror spasi YAML
    paths: {
      '/health': {
        get: {
          summary: 'Cek kesehatan server Express',
          tags: ['Sistem'],
          responses: { 200: { description: 'Server berjalan dengan sehat' } }
        }
      },
      '/info': {
        get: {
          summary: 'Ambil informasi dasar aplikasi',
          tags: ['Sistem'],
          responses: { 200: { description: 'Berhasil mengambil info' } }
        }
      },
      '/api/v1/tasks': { 
        get: {
          summary: 'Ambil daftar task dengan pagination, filtering, dan sorting',
          tags: ['Tasks'],
          responses: { 200: { description: 'Berhasil mengambil daftar task' } }
        },
        post: {
          summary: 'Buat task baru',
          tags: ['Tasks'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTask' } } }
          },
          responses: { 201: { description: 'Task berhasil dibuat' }, 400: { description: 'Data tidak valid' } }
        }
      },
      '/tasks': {
        get: {
          summary: 'Ambil daftar task dengan pagination, filtering, dan sorting',
          tags: ['Tasks'],
          responses: { 200: { description: 'Berhasil mengambil daftar task' } }
        },
        post: {
          summary: 'Buat task baru',
          tags: ['Tasks'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTask' } } }
          },
          responses: { 201: { description: 'Task berhasil dibuat' }, 400: { description: 'Data tidak valid' } }
        }
      }
    }
  },
  apis: [], // Kosongkan ini agar dia tidak membaca komentar file lain yang rusak
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: `${config.appName} - API Docs`,
  }));

  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`🚀 Docs: http://localhost:${config.port}/api/docs`);
};

module.exports = setupSwagger;