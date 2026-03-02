import {email, z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 character")
    .max(20,"Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Not contain any special character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email....."}),
    password: z.string().min(6,{message: "Password Must be at least 6 characters"})
})