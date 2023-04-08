
import type { NextApiRequest, NextApiResponse } from 'next';

import { searchPostsQuery } from '@/utils/queries';
import { client } from '@/utils/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { searchTerm }: any = req.query

      const videoQuery = searchPostsQuery(searchTerm)
      const videos = await client.fetch(videoQuery);

      res.status(200).json(videos)
   }
}