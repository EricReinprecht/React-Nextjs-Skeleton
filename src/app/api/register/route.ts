import { handleHttpError } from '@/src/server/response';
import { authService } from '@/src/server/services/auth.service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await authService.register(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return handleHttpError(error);
    }
}
