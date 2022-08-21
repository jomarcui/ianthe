import dbConnect from '../../../../../lib/dbConnect';
import Match from '../../../../../models/Match';

const handleError = ({ error, res, status = 400 }) => {
  console.error(error);
  res.status(status).json({ success: false });
};

const handler = async (req, res) => {
  const {
    body,
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'DELETE':
      try {
        await Match.findByIdAndDelete(id);

        res.status(200).json({ success: true });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    case 'GET':
      try {
        const matches = await Match.find({
          league: id,
        }).populate({ path: 'teams.team' });

        // if (!matches) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: matches });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    case 'PATCH': {
      try {
        const match = await Match.findById(id);

        for (const [key, value] of Object.entries(body)) {
          match[key] = value;
        }

        await match.save();

        res.status(200).json({ success: true, data: match });
      } catch (error) {
        handleError({ error, res });
      }

      break;
    }

    case 'POST':
      try {
        const { date, league, status, teams } = body;

        const newMatch = await new Match({
          date,
          league,
          status,
          teams,
        }).save();

        res.status(200).json({ success: true, data: newMatch });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    default:
      break;
  }
};

export default handler;
