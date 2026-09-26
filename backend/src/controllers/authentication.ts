import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data";
import { User, UserStatus, UserRole } from "../entities/users";
import { getJwtSecret } from "../middleware/user_auth";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword, email, vatNumber, firstName, lastName, phone, address, city, country, latitude, longitude } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check duplicate username or email
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }, { vatNumber }]
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username, Email, or VAT Number already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      username,
      passwordHash,
      email,
      vatNumber,
      firstName,
      lastName,
      phone,
      address,
      city,
      country,
      latitude,
      longitude,
      role: UserRole.ATTENDEE, // default, can be toggled in frontend profile
      status: UserStatus.PENDING // Requires admin approval
    });

    await userRepository.save(user);

    return res.status(201).json({
      message: "Registration submitted successfully. Approval by an administrator is pending."
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration.", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.status !== UserStatus.APPROVED && user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Your account has not been approved by an administrator yet." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      getJwtSecret(),
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login.", error });
  }
};