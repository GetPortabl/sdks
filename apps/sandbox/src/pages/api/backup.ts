import { NextApiHandler } from 'next';
import axios from 'axios';

const handler: NextApiHandler = async (req, res) => {
  // Create new league
  if (req.method === 'POST') {
    try {
      const { data } = await axios.post(
        // TODO: Replace with relavant client sdk calls
        process.env.BACKUP_ENDPOINT_URL || '',
        {},
        {
          headers: {
            // TODO: once we replace with relevant client sdk calls we will no longer need to pass the token
            authorization: req.headers.authorization || '',
          },
        },
      );

      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong', e });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
