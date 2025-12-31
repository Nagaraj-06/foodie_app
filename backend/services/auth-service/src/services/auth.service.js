const prisma = require("../config/db.js");
const redis = require("../config/redis.js");
const axios = require("axios");
const { generateToken } = require("../utils/jwt.js");
require("dotenv").config();

// Login service
async function loginUser({ email, password }) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
}

const OTP_EXPIRY = 300; // 5 minutes

const sendOtpService = async (phone) => {
  if (!phone) {
    const err = new Error("phone is required");
    err.statusCode = 400;
    throw err;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // store OTP in redis
  await redis.set(`otp:${phone}`, otp, "EX", OTP_EXPIRY);

  // try {
  //   const response = await axios.post(
  //     "https://www.fast2sms.com/dev/bulkV2",
  //     {
  //       // sender_id: "FSTSMS",
  //       route: "otp",
  //       // message: "english",
  //       numbers: phone,
  //       variables_values: otp,
  //     },
  //     {
  //       headers: {
  //         authorization: process.env.FAST2SMS_API_KEY,
  //       },
  //     }
  //   );
  //   console.log("Fast2SMS response:", response.data);
  // } catch (err) {
  //   console.log("Fast2SMS error response:", err.response?.data);
  //   throw err;
  // }

  console.log(`OTP for ${phone}: ${otp}`);

  return true;
};

const verifyOtpService = async (phone, inputOtp) => {
  const savedOtp = await redis.get(`otp:${phone}`);

  if (!savedOtp) {
    throw new Error("OTP expired");
  }

  if (savedOtp !== inputOtp) {
    throw new Error("Invalid OTP");
  }

  await redis.del(`otp:${phone}`);
  // check if user exists
  let user = await prisma.users.findFirst({ where: { phone_number: phone } });
  if (!user) {
    user = await prisma.users.create({
      data: { phone_number: phone, role_id: "customer_role_id" }, // use customer role
    });
  }

  // create JWT token
  const token = generateToken({
    id: user.id,
    role: user.role_id,
  });

  return { token, user };
};

const googleLoginService = async (email, name) => {
  let user = await prisma.users.findFirst({ where: { email } });
  if (!user) {
    user = await prisma.users.create({
      data: { email, first_name: name, role_id: "customer_role_id" },
    });
  }

  const token = generateToken({
    id: user.id,
    role: user.role_id,
  });

  return { token, user };
};

module.exports = {
  loginUser,
  sendOtpService,
  verifyOtpService,
  googleLoginService,
};
