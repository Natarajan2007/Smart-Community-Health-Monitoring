/**
 * OpenAPI/Swagger Documentation
 * Complete API documentation for developers
 */

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Smart Community Health Monitoring API',
    version: '1.0.0',
    description: 'Backend API for Aadhaar & DBT awareness platform with AI chat support',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://api.example.com',
      description: 'Production server'
    }
  ],
  paths: {
    '/api/chat': {
      post: {
        tags: ['Chat'],
        summary: 'Process chat messages with AI',
        description: 'Send conversation messages to OpenAI for intelligent responses',
        operationId: 'postChat',
        requestBody: {
          required: true,
          description: 'Chat request with conversation history',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 50,
                    description: 'Array of message objects with role and content',
                    items: {
                      type: 'object',
                      required: ['role', 'content'],
                      properties: {
                        role: {
                          type: 'string',
                          enum: ['system', 'user', 'assistant'],
                          description: 'Message role - who sent it'
                        },
                        content: {
                          type: 'string',
                          minLength: 1,
                          maxLength: 4000,
                          description: 'Message text content'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Chat processed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string', description: 'AI response message' },
                    processingTime: { type: 'number', description: 'Time in milliseconds' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid request format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    error: { type: 'string' }
                  }
                }
              }
            }
          },
          429: {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    error: { type: 'string' },
                    retryAfter: { type: 'number', description: 'Seconds to wait' }
                  }
                }
              }
            }
          },
          500: {
            description: 'Server error'
          }
        },
        security: []
      }
    },
    '/api/health': {
      get: {
        tags: ['Monitoring'],
        summary: 'API health check',
        description: 'Returns current health status with error rates',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['healthy', 'degraded'] },
                    uptime: { type: 'number' },
                    metrics: {
                      type: 'object',
                      properties: {
                        totalRequests: { type: 'number' },
                        errorCount: { type: 'number' },
                        errorRate: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          503: {
            description: 'Service is degraded'
          }
        }
      }
    },
    '/api/metrics': {
      get: {
        tags: ['Monitoring'],
        summary: 'Performance metrics',
        description: 'Get detailed performance metrics and recent request statistics',
        operationId: 'getMetrics',
        responses: {
          200: {
            description: 'Metrics data retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    timestamp: { type: 'string', format: 'date-time' },
                    summary: { type: 'object' },
                    recentPerformance: { type: 'object' },
                    memory: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/status': {
      get: {
        tags: ['Monitoring'],
        summary: 'Comprehensive server status',
        description: 'Get detailed server status including dependencies',
        operationId: 'getStatus',
        responses: {
          200: {
            description: 'Status information retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    server: { type: 'object' },
                    api: { type: 'object' },
                    memory: { type: 'object' },
                    dependencies: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/logs': {
      get: {
        tags: ['Monitoring'],
        summary: 'Log analytics summary',
        description: 'Get access logs, error logs, and audit trail summaries',
        operationId: 'getLogs',
        responses: {
          200: {
            description: 'Log data retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    timestamp: { type: 'string' },
                    requests: { type: 'object' },
                    errors: { type: 'object' },
                    audits: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Message: {
        type: 'object',
        required: ['role', 'content'],
        properties: {
          role: {
            type: 'string',
            enum: ['system', 'user', 'assistant'],
            description: 'Message sender role'
          },
          content: {
            type: 'string',
            description: 'Message content',
            minLength: 1,
            maxLength: 4000
          }
        }
      },
      ChatRequest: {
        type: 'object',
        required: ['messages'],
        properties: {
          messages: {
            type: 'array',
            items: { $ref: '#/components/schemas/Message' },
            minItems: 1,
            maxItems: 50
          }
        }
      },
      ChatResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          processingTime: { type: 'number' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' },
          requestId: { type: 'string' }
        }
      }
    },
    securitySchemes: {}
  },
  tags: [
    {
      name: 'Chat',
      description: 'AI chat endpoints'
    },
    {
      name: 'Monitoring',
      description: 'Health checks and metrics endpoints'
    }
  ]
};

export default openApiSpec;
