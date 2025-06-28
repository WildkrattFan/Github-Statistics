import * as fs from 'fs';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(file: File): Promise<string> {
    const abuffer = await file.arrayBuffer();
    const buffer = Buffer.from(abuffer);
    const data = await pdfParse(buffer);
    return data.text;
}


