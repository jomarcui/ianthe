import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

const handler = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const user = await User.findById(id).populate('transactions');

        if (!user) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;

    default:
      break;
  }
};

export default handler;
