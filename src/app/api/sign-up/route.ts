import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingUserByUsername = await UserModel.findOne({ username })

        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already Taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail) {
            return Response.json({
                success: false, 
                message: 'User already exists with this email'
            }, { status: 400 })
        } else {
            const hasedPassword = await bcrypt.hash(password, 10)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                isVerified: true,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save()
        }

        return Response.json({ success: true, message: "User registered successfully." }, { status: 201 })

    } catch (error) {
        console.error('Error registering user:', error)
        return Response.json({ success: false, message: 'Failed to register user' }, { status: 500 })
    }
}
