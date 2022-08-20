import dbConnect from '../../../lib/dbConnect';
import Schedule from '../../../models/Schedule';

const handleError = ({ error, res }) => {
  console.error(error);
  res.status(400).json({ success: false });
};

const handler = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const schedules = await Schedule.findById(id)
          .populate({
            path: 'league',
            populate: { path: 'sport' },
          })
          .populate({
            path: 'teams.team',
          });

        if (!schedules) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: schedules });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    default:
      break;
  }
};

export default handler;
