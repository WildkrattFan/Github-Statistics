// import * as fs from 'fs';

export async function extractTextFromPDF(file: File): Promise<string> {
    const pdfParse = (await import('pdf-parse')).default;
    const abuffer = await file.arrayBuffer();
    const buffer = Buffer.from(abuffer);
    const data = await pdfParse(buffer);
    return data.text;
}


