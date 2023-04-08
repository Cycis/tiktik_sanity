import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'stkbfsph',
  dataset: 'production',
  apiVersion: '2021-10-21',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});


