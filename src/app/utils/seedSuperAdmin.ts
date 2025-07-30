/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  const isSuperAdminExist = await User.findOne({
    email: envVars.SUPER_ADMIN_EMAIL,
  });
  if (isSuperAdminExist) {
    console.log("Super Admin already exists.");
    return;
  }

  console.log("Super admin creating...");

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: envVars.SUPER_ADMIN_EMAIL,
  };

  const hashedPassword = await bcrypt.hash(
    envVars.SUPER_ADMIN_PASSWORD,
    envVars.SALT_ROUND
  );
  const payload: IUser = {
    name: "Super Admin",
    email: envVars.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    role: Role.SUPER_ADMIN,
    isVerified: true,
    auths: [authProvider],
  };
  await User.create(payload);

  console.log("Super Admin created..");
};
