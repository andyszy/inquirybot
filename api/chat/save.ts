import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

// Configure Prisma for Supabase connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1'
    }
  }
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, topic, questions, selectedQuestion, messages } = req.body;

    if (!topic || !questions || !selectedQuestion || !messages) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let chatSession;

    if (id) {
      // Update existing session
      chatSession = await prisma.chatSession.update({
        where: { id },
        data: {
          topic,
          questions,
          selectedQuestion,
          messages,
        },
      });
    } else {
      // Create new session
      chatSession = await prisma.chatSession.create({
        data: {
          topic,
          questions,
          selectedQuestion,
          messages,
        },
      });
    }

    return res.status(200).json({ id: chatSession.id });
  } catch (error) {
    console.error('Error saving chat session:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

