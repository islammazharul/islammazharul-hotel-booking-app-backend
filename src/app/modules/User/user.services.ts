import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  try {
    // create a user
    const newUser = await User.create([userData]);

    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    return newUser;
  } catch (err: any) {
    throw new Error(err.message);
  }
  //   try {
  //     const user = new User(userData);
  //     await user.save();
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
};

export const UserServices = {
  createUserIntoDB,
};
