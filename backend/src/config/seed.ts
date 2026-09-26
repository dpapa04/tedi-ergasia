import bcrypt from "bcrypt";
import { AppDataSource } from "./data";
import { User, UserRole, UserStatus } from "../entities/users";

export const ensureAdminUser = async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD must be configured to seed the administrator account.");
  }

  const repository = AppDataSource.getRepository(User);
  const existing = await repository.findOne({ where: [{ username }, { role: UserRole.ADMIN }] });
  if (existing) {
    if (existing.role !== UserRole.ADMIN) {
      throw new Error(`Cannot seed administrator: username '${username}' is already in use.`);
    }
    if (existing.status !== UserStatus.APPROVED) {
      existing.status = UserStatus.APPROVED;
      await repository.save(existing);
    }
    return;
  }

  const admin = repository.create({
    username,
    passwordHash: await bcrypt.hash(password, 12),
    firstName: "Application",
    lastName: "Administrator",
    email: process.env.ADMIN_EMAIL || `${username}@localhost`,
    phone: "",
    address: "",
    city: "",
    country: "",
    vatNumber: process.env.ADMIN_VAT_NUMBER || `ADMIN-${username}`,
    role: UserRole.ADMIN,
    status: UserStatus.APPROVED,
  });
  await repository.save(admin);
};