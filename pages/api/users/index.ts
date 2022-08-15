import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await User.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false });
      }
      break;

    case 'POST':
      try {
        const newUser = new User({...req.body,
          password: await bcrypt.hash(req.body.password, 10)
        });

        newUser
          .save()
          .then((user) => res.status(201).json(user));
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
