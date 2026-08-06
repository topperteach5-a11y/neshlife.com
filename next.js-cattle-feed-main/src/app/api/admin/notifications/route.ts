import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'src', 'data', 'notifications.json');

async function getNotifications() {
  try {
    const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveNotifications(notifications: any[]) {
  await fs.mkdir(path.dirname(NOTIFICATIONS_FILE), { recursive: true });
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

// Fetch all notifications
export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await getNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// Mark notification as read or add new one
export async function PUT(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Add new notification
    if (body.type && !body.id) {
      const newNotification = {
        id: crypto.randomUUID(),
        type: body.type,
        title: body.title,
        message: body.message,
        isRead: false,
        relatedId: body.relatedId || null,
        createdAt: new Date().toISOString()
      };
      
      const notifications = await getNotifications();
      notifications.unshift(newNotification);
      
      // Limit to 100
      if (notifications.length > 100) notifications.pop();
      
      await saveNotifications(notifications);
      return NextResponse.json(newNotification);
    }
    
    // Update existing notification
    const { id, isRead } = body;
    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    let notifications = await getNotifications();
    let updated = null;
    
    notifications = notifications.map((n: any) => {
      if (n.id === id) {
        updated = { ...n, isRead };
        return updated;
      }
      return n;
    });

    await saveNotifications(notifications);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// Clear all read notifications
export async function DELETE(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await getNotifications();
    const unread = notifications.filter((n: any) => !n.isRead);
    
    await saveNotifications(unread);

    return NextResponse.json({ success: true, deletedCount: notifications.length - unread.length });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
  }
}
