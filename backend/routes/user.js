const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

// Signup route
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "User Already Exists",
    });
  }

  const newUser = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  const userId = newUser._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

// SignIn route
router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const returnUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (returnUser) {
    const token = jwt.sign(
      {
        userId: returnUser._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
  }

  return res.status(411).json({
    message: "Error while logging in",
  });
});

module.exports = router;
