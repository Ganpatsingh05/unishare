import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return empty navigation data for now
    const navigationData = {};
    
    return NextResponse.json(navigationData);
  } catch (error) {
    console.error('Error in loadnav API:', error);
    return NextResponse.json(
      { error: 'Failed to load navigation data' },
      { status: 500 }
    );
  }
}