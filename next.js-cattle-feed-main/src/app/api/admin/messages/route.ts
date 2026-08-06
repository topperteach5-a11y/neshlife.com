import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'src', 'data', 'messages.json');

async function getMessages() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMessages(messages: any[]) {
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// PUBLIC: Submit a new contact message (no auth required)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const newMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'General',
      message: message || '',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const messages = await getMessages();
    messages.unshift(newMessage);

    // Limit to 200
    if (messages.length > 200) messages.pop();

    await saveMessages(messages);

    // Fire off a notification
    try {
      fetch(`${request.headers.get('origin') || 'http://localhost:4028'}/api/admin/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MESSAGE',
          title: 'New Customer Message',
          message: `${name} sent a message: "${(message || '').slice(0, 60)}${message?.length > 60 ? '...' : ''}"`,
          relatedId: newMessage.id
        })
      }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

// ADMIN: Get all contact messages
export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// ADMIN: Mark message as read or delete
export async function PUT(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    let messages = await getMessages();
    messages = messages.map((m: any) =>
      m.id === id ? { ...m, isRead } : m
    );

    await saveMessages(messages);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// ADMIN: Delete a message
export async function DELETE(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    let messages = await getMessages();
    messages = messages.filter((m: any) => m.id !== id);

    await saveMessages(messages);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
