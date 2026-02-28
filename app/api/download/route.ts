// app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createVoucherPDF } from '@/lib/pdf';

export async function POST(request: NextRequest) {
  console.log('API route called - Starting PDF generation');
  
  try {
    // Parse the request body
    let data;
    try {
      data = await request.json();
      console.log('Received data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['voucherNo', 'date', 'hotelName', 'clients', 'checkIn', 'checkOut'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Validation passed, generating PDF...');
    
    // Generate the PDF
    const pdfBuffer = await createVoucherPDF(data);
    
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="voucher-${data.voucherNo || 'download'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error in API route:', error);
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  );
}