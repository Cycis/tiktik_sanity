
import type { NextApiRequest, NextApiResponse } from 'next';

import { allUsersQuery } from './../../utils/queries';
import { client } from '../../utils/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const doc = req.body;

   const result = await client.createIfNotExists(doc);
   res.status(200).json(result)
}