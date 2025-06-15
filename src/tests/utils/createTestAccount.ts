import Auth from "../../models/Auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateAccessToken } from "../../utils/jwt";

dotenv.config();

export const createTestAccount = async (role: string) => {
  const password = await bcrypt.hash("testpassword", 10);
  const account = await Auth.create({
    name: `test-${role}`,
    email: `test-${role}@test.com`,
    password,
    role,
  });

  const accessToken = generateAccessToken(account._id.toString());

  return { account, accessToken };
};
