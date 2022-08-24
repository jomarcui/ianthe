import { endOfDay, startOfDay } from 'date-fns';
import dbConnect from '../../../../../../lib/dbConnect';
import Match from '../../../../../../models/Match';

const handler = async (req, res) => {
  const {
    method,
    query: { id, date },
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const matches = await Match.find({
          league: id,
          date: {
            $gte: startOfDay(new Date(date)),
            $lte: endOfDay(new Date(date)),
          },
        })
          .populate({
            path: 'league',
            populate: { path: 'sport' },
          })
          .populate({ path: 'teams.team' });

        res.status(200).json({ success: true, data: matches });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;

    default:
      break;
  }
};

export default handler;
