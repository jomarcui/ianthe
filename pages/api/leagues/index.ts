import dbConnect from '../../../lib/dbConnect';
import League from '../../../models/League';

const handler = async (req, res) => {
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const leagues = await League.find();
        res.status(200).json({ success: true, data: leagues });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }

      break;

    case 'POST':
      try {
        const { date, league, status, teams } = query;
        console.log({ date, league, status, teams });
        res.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }

    default:
      break;
  }
};

export default handler;
