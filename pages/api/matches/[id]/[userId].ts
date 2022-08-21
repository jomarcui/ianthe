import dbConnect from '../../../../lib/dbConnect';
import Transaction from '../../../../models/Transaction';

const handleError = ({ error, res, status = 400 }) => {
  console.error(error);
  res.status(status).json({ success: false });
};

const handler = async (req, res) => {
  const {
    method,
    query: { id, userId },
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const transactions = await Transaction.find({
          match: id,
          user: userId,
        });

        res.status(200).json({ success: true, data: transactions });
      } catch (error) {
        handleError({ error, res });
      }
      break;

    default:
      break;
  }
};

export default handler;
