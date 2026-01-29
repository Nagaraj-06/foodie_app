const { prisma } = require("@foodie-app/prisma-client");
const redis = require("../config/redis.js");
const axios = require("axios");
const {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt.js");
require("dotenv").config();

const {
  REFRESH_SECRET,
} = require("../config/env.js");

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

const OTP_EXPIRY = 600; // 10 minutes

const sendOtpService = async (phone, role_id) => {
  // Check role exists
  const role = await prisma.roles_master.findUnique({
    where: { id: role_id },
  });

  if (!role) {
    throw new Error("Role does not exist");
  }

  // Check user exists
  let user = await prisma.users.findUnique({
    where: { phone_number: phone },
  });

  // Role mismatch
  if (user && user.role_id !== role_id) {
    throw new Error("Role mismatch. Please login with correct role");
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

// helper: create owner + restaurant in transaction
async function createOwnerWithRestaurant(prisma, userData) {
  return await prisma.$transaction(async (tx) => {
    // create user
    const user = await tx.users.create({
      data: {
        role_id: userData.role_id,
        phone_number: userData.phone_number ?? null,
        email: userData.email ?? null,
      },
    });

    // create restaurant
    const restaurant = await tx.restaurants.create({
      data: {
        owner_user_id: user.id,
      },
    });

    return { user, restaurant };
  });
}

const verifyOtpService = async (phone, otp, role_id) => {
  const savedOtp = await redis.get(`otp:${phone}`);

  if (!savedOtp) throw new Error("OTP expired");

  if (savedOtp !== otp) throw new Error("Invalid OTP");

  // await redis.del(`otp:${phone}`);

  let role = await prisma.roles_master.findFirst({
    where: { id: role_id },
  });

  if (!role) {
    throw new Error("Role does not exist");
  }

  //Check if user already exists

  let user = await prisma.users.findUnique({
    where: { phone_number: phone },
    select: {
      id: true,
      role_id: true,
    },
  });

  // If user exists but role is different
  if (user && user.role_id !== role_id) {
    throw new Error("Role mismatch. Please login with correct role");
  }

  // new user → create with selected role
  // create user if not exists
  if (!user) {
    // OWNER → create user + restaurant
    if (role.name === "restaurant_owner") {
      const result = await createOwnerWithRestaurant(prisma, {
        role_id,
        phone_number: phone,
      });

      user = result.user;
    }
    // NORMAL USER
    else {
      user = await prisma.users.create({
        data: {
          phone_number: phone,
          role_id,
        },
      });
    }
  }

  // create tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // store refresh token in Redis (revocable)
  await redis.set(`refresh:${user.id}`, refreshToken, "EX", 30 * 24 * 60 * 60); // 30 days

  return { user, accessToken, refreshToken };
};

const googleLoginService = async (email, name, role_id) => {
  // check if user already exists
  let user = await prisma.users.findUnique({
    where: { email: email },
    select: {
      id: true,
      role_id: true,
    },
  });

  // If user exists but role is different
  if (user && user.role_id !== role_id) {
    throw new Error("Role mismatch. Please login with correct role");
  }

  // new user → create with selected role
  if (!user) {
    user = await prisma.users.create({
      data: { email, first_name: name, role_id },
    });
  }

  // create tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // store refresh token in Redis (revocable)
  await redis.set(`refresh:${user.id}`, refreshToken, "EX", 30 * 24 * 60 * 60); // 30 days

  return { user, accessToken, refreshToken };
};

// refresh token

const refreshTokenService = async (user_id, token) => {
  // check stored token in Redis
  const stored = await redis.get(`refresh:${user_id}`);

  if (!stored || stored !== token) throw new Error("Invalid refresh token");

  // verify refresh token
  const payload = verifyToken(token, REFRESH_SECRET); // reuse verifyToken helper

  // generate new access token
  const newAccessToken = generateAccessToken({
    id: payload.user_id,
    role_id: payload.role_id,
  });

  return { accessToken: newAccessToken };
};

// logout
const logoutService = async (user_id) => {
  await redis.del(`refresh:${user_id}`);
  return true;
};

module.exports = {
  loginUser,
  sendOtpService,
  verifyOtpService,
  googleLoginService,
  refreshTokenService,
  logoutService,
};
