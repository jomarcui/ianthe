import dbConnect from '../../../lib/dbConnect';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';

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
    case 'GET':
      try {
        const users = await User.find().populate('transactions');
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    case 'PATCH':
      try {
        const transaction = await Transaction.findById(id);

        for (const [key, value] of Object.entries(body)) {
          transaction[key] = value;
        }

        await transaction.save();

        res.status(200).json({ success: true, data: transaction });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    case 'POST':
      try {
        const newTransaction = new Transaction({ ...req.body });

        newTransaction.save().then(async (transaction) => {
          const user = await User.findById(transaction.user);
          user.transactions.push(transaction.id);
          user.save();

          res.status(200).json({ success: true, data: transaction });
        });
      } catch (error) {
        handleError({ error, res });
      }
  }
};

export default handler;
