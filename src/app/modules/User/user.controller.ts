import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';
// import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const result = await UserServices.createUserIntoDB(userData);
  //   console.log(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
};
