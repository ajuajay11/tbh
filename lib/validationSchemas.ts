// app/lib/validationSchemas.ts
import { z } from "zod";

// -----------------------------
// 1️⃣ Register Schema
// -----------------------------
export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .max(100)
    .transform((e) => e.trim().toLowerCase()),
  password: z
    .string()
    .min(6)
    .max(100)
    .transform((p) => p.trim()),
  firstname: z
    .string()
    .min(1)
    .max(50)
    .transform((f) => f.trim()),
  lastname: z
    .string()
    .min(1)
    .max(50)
    .transform((f) => f.trim()),
  gender: z.enum(["male", "female", "other"]),
  username: z
    .string()
    .max(30)
    .optional()
    .transform((u) => u?.trim()),
  profilePicture: z.string().url().optional(),
  age: z.number().int().min(1).max(120).optional(),
});

// -----------------------------
// 2️⃣ Login Schema
// -----------------------------
export const loginSchema = z.object({
  email: z.string().email().max(100).transform(e => e.trim().toLowerCase()),
  password: z.string().min(6).max(100).transform(p => p.trim()),
});
 
// -----------------------------
// 3️⃣ Create / Edit Post Schema
// -----------------------------
export const postSchema = z.object({
  yourStoryTitle: z.string().min(1).max(200).transform(t => t.trim()),
  chroniclesOfYou: z.string().min(1).transform(t => t.trim()),
  emailAllowed: z.boolean(),
  replyAllowed: z.boolean(),
  comments: z
    .array(z.object({
      userId: z.string(),
      comment: z.string().min(1).max(1000),
    }))
    .optional(),
});

export const commentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long"),
});
// -----------------------------
// 4️⃣ Update Profile Schema
// -----------------------------
export const updateProfileSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long")
    .optional(),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long")
    .optional(),
   gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    message: "Invalid gender value"
  }).optional(),
  age: z
    .number()
    .int()
    .min(13, "Must be at least 13 years old")
    .max(120, "Invalid age")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long")
    .optional(),
});
