import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

const router = Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = User.create({ username, email, password: hashedPassword });
  await user.save();
  res.json(user);
});

router.post("/login", async (req, res): Promise<any> => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
  res.json({ token });
});

export default router;
