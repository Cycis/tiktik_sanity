import type { NextApiRequest, NextApiResponse } from 'next';
import { uuid } from 'uuidv4';

import { client } from '../../utils/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'PUT') {
      const { userId, postId, like } = req.body;

      const data =
         like === false &&
            await client
               .patch(postId)
               .unset([`likes[_ref=="${userId}"]`])
               .commit()


      res.status(200).json(data);
   }
}