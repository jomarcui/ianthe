import { endOfDay, startOfDay } from 'date-fns';
import dbConnect from '../../../../lib/dbConnect';
import Match from '../../../../models/Match';

const handleError = ({ error, res, status = 400 }) => {
  console.log(error);
  res.status(status).json({ success: false });
};

const handler = async (req, res) => {
  const {
    method,
    query: { dateEnd, dateStart },
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const matches = await Match.find({
          $gte: startOfDay(new Date(dateStart)),
          $lte: endOfDay(new Date(dateEnd)),
          status: { $ne: 'ENDED' },
        });

        res.status(200).json({ success: true, data: matches });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    default:
      break;
  }
};

export default handler;
