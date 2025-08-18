// app/actions/revalidate.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateOrganizationPage() {
  revalidatePath('/'); // path you want to revalidate
}
