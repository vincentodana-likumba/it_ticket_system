import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const priority = searchParams.get('priority') || '';
    const department = searchParams.get('department') || '';

    const where = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (priority && priority !== 'All') {
      where.priority = priority;
    }

    if (department && department !== 'All') {
      where.department = department;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { requester: { contains: search } },
        { id: { contains: search } },
        { department: { contains: search } }
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      priority, 
      department,
      contactEmail,
      requester, 
      impact,
      assignedTo 
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        category: category || "Other",
        priority: priority || "Low",
        department: department || "General IT",
        contactEmail: contactEmail || "user@maxim.com",
        requester: requester || "John Doe",
        impact: impact || "Individual",
        assignedTo: assignedTo || null
      }
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
