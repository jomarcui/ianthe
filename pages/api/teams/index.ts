import dbConnect from '../../../lib/dbConnect';
import Team from '../../../models/Team';

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const teams = await Team.find();
        res.status(200).json({ success: true, data: teams });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;
  }
};

export default handler;
