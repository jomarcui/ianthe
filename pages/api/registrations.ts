import bcrypt from 'bcrypt';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

const handleError = ({ res, error = null, status = 400 }) => {
  console.error(error);
  res.status(status).json({ success: false });
};

const handler = async (req, res) => {
  const {
    method,
    query: { firstName, lastName, mobileNumber, password },
  } = req.body;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const userFound = await User.findOne({ mobileNumber });

        if (userFound) return handleError({ res, status: 409 });

        const passwordHashed = await bcrypt.hash(password, 10);

        const newUser = new User({
          firstName,
          lastName,
          mobileNumber,
          password: passwordHashed,
        });

        await newUser.validate();

        await newUser.save();

        res.status(200).json({ success: true, data: newUser });
      } catch (error) {
        handleError({ error, res });
      }

      break;

    default:
      break;
  }
};

export default handler;
