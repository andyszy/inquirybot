import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { PrismaClient } from '@prisma/client'
import type { Connect } from 'vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Manually read DATABASE_URL from .env.local to override .env
function getDatabaseUrl(): string | undefined {
  try {
    const envLocal = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    // Match DATABASE_URL and capture everything after the = sign
    const match = envLocal.match(/^DATABASE_URL\s*=\s*["']?(.+?)["']?\s*$/m)
    if (match) {
      // Remove any literal \n or \\n characters and trim whitespace
      let url = match[1].trim()
      url = url.replace(/\\n/g, '').replace(/\n/g, '').trim()
      console.log('[Config] Cleaned DATABASE_URL length:', url.length)
      return url
    }
  } catch (e) {
    // .env.local doesn't exist, fall back to process.env
  }
  return process.env.DATABASE_URL
}

const DATABASE_URL = getDatabaseUrl()

// Create a new Prisma client for each request to avoid pooling issues
function getPrisma() {
  console.log('[Prisma] Creating new client for request')
  // Add pgbouncer=true to the connection string for Supabase connection pooling
  const pooledUrl = DATABASE_URL?.includes('?') 
    ? `${DATABASE_URL}&pgbouncer=true&connection_limit=1`
    : `${DATABASE_URL}?pgbouncer=true&connection_limit=1`
  
  return new PrismaClient({
    datasources: {
      db: {
        url: pooledUrl
      }
    }
  })
}

async function parseJsonBody(req: Connect.IncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', err => reject(err))
  })
}

function apiPlugin(): Plugin {
  return {
    name: 'api-middleware',
    configureServer(server) {
      console.log('[API Plugin] Configuring server...')
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next()

        const url = req.url
        
        // Debug logging
        if (url.startsWith('/api/')) {
          console.log('[API Middleware] Request:', req.method, url)
        }

        // Handle /api/chat/save
        if (url === '/api/chat/save' || url.startsWith('/api/chat/save?')) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 200
            res.end()
            return
          }

          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          const prismaClient = getPrisma()
          try {
            const body = await parseJsonBody(req)
            const { id, topic, questions, selectedQuestion, messages } = body

            if (!topic || !questions || !selectedQuestion || !messages) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing required fields' }))
              return
            }

            let chatSession
            if (id) {
              chatSession = await prismaClient.chatSession.update({
                where: { id },
                data: {
                  topic,
                  questions,
                  selectedQuestion,
                  messages,
                },
              })
            } else {
              chatSession = await prismaClient.chatSession.create({
                data: {
                  topic,
                  questions,
                  selectedQuestion,
                  messages,
                },
              })
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ id: chatSession.id }))
          } catch (err: any) {
            console.error('Dev API error (/api/chat/save):', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error', details: err?.message }))
          } finally {
            await prismaClient.$disconnect()
          }
          return
        }

        // Handle /api/chat/:id
        const chatMatch = url.match(/^\/api\/chat\/([^/?]+)/)
        if (chatMatch) {
          const chatId = chatMatch[1]
          console.log('[API Middleware] Matched chat ID:', chatId)

          if (req.method === 'OPTIONS') {
            res.statusCode = 200
            res.end()
            return
          }

          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          const prismaClient = getPrisma()
          try {
            const chatSession = await prismaClient.chatSession.findUnique({
              where: { id: chatId },
            })

            if (!chatSession) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Session not found' }))
              return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              topic: chatSession.topic,
              questions: chatSession.questions,
              selectedQuestion: chatSession.selectedQuestion,
              messages: chatSession.messages,
            }))
          } catch (err: any) {
            console.error('Dev API error (/api/chat/:id):', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error', details: err?.message }))
          } finally {
            await prismaClient.$disconnect()
          }
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 5173,
  },
})
