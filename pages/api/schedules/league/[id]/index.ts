import dbConnect from '../../../../../lib/dbConnect';
import Schedule from '../../../../../models/Schedule';

const handleError = ({ error, res }) => {
  console.error(error);
  res.status(400).json({ success: false });
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
        await Schedule.findByIdAndDelete(id);

        res.status(200).json({ success: true });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    case 'GET':
      try {
        const schedules = await Schedule.find({
          league: id,
        }).populate({ path: 'teams.team' });

        if (!schedules) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: schedules });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    case 'PATCH': {
      try {
        const schedule = await Schedule.findById(id);

        for (const [key, value] of Object.entries(body)) {
          schedule[key] = value;
        }

        console.log(schedule);

        await schedule.save();

        res.status(200).json({ success: true, data: schedule });
      } catch (error) {
        handleError({ error, res });
      }

      break;
    }

    case 'POST':
      try {
        const { date, league, status, teams } = body;

        const newSchedule = await new Schedule({
          date,
          league,
          status,
          teams,
        }).save();

        res.status(200).json({ success: true, data: newSchedule });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    default:
      break;
  }
};

export default handler;
