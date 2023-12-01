const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require('../extra/generateToken');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await Users.findOne({ email });
    if (!result) {
      res.status(400).json({
        success: false,
        message: `User with email ${email} not found`,
      });
    }

    const validatePwd = await bcrypt.compare(password, result.password);
   
    if (!validatePwd) {
      return res.status(400).json({
        success: false,
        message: `password is  wrong`,
      });
    }
   
    res.status(200).json({
      success: true,
      message: `login successfully`,
      data: {
        ...result._doc,
        token: generateToken(result._id, result.role)
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to login`,
      err:err.message,
    });
  }
};

const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, city, fullAddress, role } =
    req.body;
  const hashpwd = await bcrypt.hash(password, 10);

  if (
    !fullName ||
    !email ||
    !password ||
    !phoneNumber
  ) {
    return res.status(401).json({ message: "All fields are required" });
  }

  const duplicate = await Users.findOne({ email });

  if (duplicate) {
    return res
      .status(409)
      .json({ message: `email ${email} already has account ` });
  }
  try {
    const result = await Users.create({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      email,
      password: hashpwd,
      phoneNumber,
      city,
      fullAddress: {
        street: fullAddress.street,
        building: fullAddress.building,
        floor: fullAddress.floor,
        description: fullAddress.description,
      },
      role: role || "client",
    });

    res.status(200).json({
      success: true,
      message: `user ${email} register successfully`,
      data: result,
      token:generateToken(result._id,result.role)
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: ` failed to register thr user ${fullName}`,
      err: err.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  try {
    const result = await Users.findById(ID);
    if (!result) {
       return res.status(404).json({
         success: false,
         message: ` user not found ${ID} `,
         err: err.message,
       });
    }
    res.status(200).json({
      success: true,
      message: `get user by id ${ID} succesfully`,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `unable to get data by id ${ID} `,
      err: err.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await Users.find({});
   if (!Array.isArray(result))
     return res.status(400).json({
       success: false,
       message: `no data found`,
       data: result,
     });
    res.status(200).json({
      success: true,
      message: `get all users succesfully`,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to get all users succesfully`,
      err: err.message,
    });
  }
};

const deleteById = async (req, res) => {
  const ID = req.params.ID;
  try {
    const result = await Users.deleteOne({ ID });
    res.status(200).json({
      success: true,
      message: `delete user with id ${ID} successfully`,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to delete user ${ID}`,
      err: err.message,
    });
  }
};
const update = async (req, res) => {
  const ID = req.params.ID;
  
  try {
    const { fullName, ...updateData } = req.body;
    
        if (fullName) {
          updateData.fullName = {
            firstName: fullName.split(" ")[0],
            lastName: fullName.split(" ")[1],
          };
        }

    const result = await Users.findByIdAndUpdate(ID,updateData);
     
    res.status(200).json({
      success: true,
      message: `update with id ${ID} successfully`,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: true,
      message: `unable to update id ${ID}`,
      data: result,
    });
  }
};

module.exports = { register, getByID, getAll, deleteById, update, login };
