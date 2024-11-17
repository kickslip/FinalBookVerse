import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
const requiredInt = z.number().int().min(1, "Must be greater than 0");

export const signUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
    vatNumber: z.string().optional(),
    ckNumber: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: requiredInt,
    streetAddress: z.string().min(1, "Street address is required"),
    addressLine2: z.string().optional(),
    suburb: z.string().optional(),
    townCity: z.string().min(1, "Town/City is required"),
    postcode: z.string().min(1, "Postcode is required"),
    country: z.enum([
      "southAfrica",
    ]),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    username: requiredString,
    password: requiredString,
});

export type loginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
    content: requiredString,
});


export const bookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    description: z.string().min(1, "Description is required"),
    publishYear: z.number()
      .int("Year must be a whole number")
      .min(1800, "Year must be 1800 or later"),
      //.max(new Date().getFullYear() + 10, "Year cannot be too far in the future"),
    price: z.number()
      .int()
      .multipleOf(0.01, "Price must have at most 2 decimal places"),
    mediaUrl: z.string().optional(),
  });
  
  export type BookValues = z.infer<typeof bookSchema>;
