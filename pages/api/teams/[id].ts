import dbConnect from '../../../lib/dbConnect';
import Team from '../../../models/Team';

const handler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const team = await Team.findById(id);

        if (!team) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: team });

      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;
  }
};

export default handler;
