import dbConnect from '../../../lib/dbConnect';
import Transaction from '../../../models/Transaction';
import User from '../../../models/User';

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await User.find().populate('transactions');
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
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
        console.error(error);
        res.status(400).json({ success: false });
      }
  }
};

export default handler;
