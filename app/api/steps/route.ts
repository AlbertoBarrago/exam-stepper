import { NextResponse } from 'next/server';
import { z } from 'zod';
import { StepSchema } from '@/types/zodValidation/stepTypes.zod';
import StepsConfig from '@/api/mock/steps';

export async function GET() {
  const validationResult = z.array(StepSchema).safeParse(StepsConfig);

  if (!validationResult.success) {
    return NextResponse.json(validationResult.error, { status: 400 });
  }

  return NextResponse.json(StepsConfig);
}
