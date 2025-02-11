import { NextResponse } from 'next/server';

// Analytics endpoint
export async function POST(req: Request) {
   try {
      const data = await req.json();

      // Here you would typically:
      // 1. Validate the incoming data
      // 2. Store analytics data in your database
      // 3. Process the analytics information

      return NextResponse.json(
         { message: 'Analytics data received successfully' },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: 'Failed to process analytics data' },
         { status: 500 }
      );
   }
}

// Text endpoint
export async function GET(req: Request) {
   try {
      // You can customize this response based on your needs
      const textData = {
         title: 'Welcome',
         content: 'This is the text endpoint response'
      };

      return NextResponse.json(textData, { status: 200 });
   } catch (error) {
      return NextResponse.json(
         { error: 'Failed to retrieve text data' },
         { status: 500 }
      );
   }
}
