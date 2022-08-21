import dbConnect from '../../../../lib/dbConnect';
import Match from '../../../../models/Match';

const handleError = ({ error, res, status = 400 }) => {
  console.error(error);
  res.status(status).json({ success: false });
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
        const match = await Match.findById(id)
          .populate({
            path: 'league',
            populate: { path: 'sport' },
          })
          .populate({
            path: 'teams.team',
          });

        // if (!schedule) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: match });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    default:
      break;
  }
};

export default handler;
