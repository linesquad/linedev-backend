import Auth from "../../models/Auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createTestAccount = async (role: string) => {
  const password = await bcrypt.hash("testpassword", 10);
  const account = await Auth.create({
    name: `test-${role}`,
    email: `test-${role}@test.com`,
    password,
    role,
  });

  const accessToken = jwt.sign(
    { id: account._id, role: account.role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return { account, accessToken };
};
