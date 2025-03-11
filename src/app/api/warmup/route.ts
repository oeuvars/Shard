import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db/drizzle';

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: 'Database warmed up' }, { status: 200 });
  } catch (error) {
    console.error('Database warmup failed:', error);
    return NextResponse.json({ error: 'Failed to warm up database' }, { status: 500 });
  }
}
