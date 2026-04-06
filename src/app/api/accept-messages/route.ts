import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Error verifying user session"
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, {
            isAcceptingMessages: acceptMessages
        },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user message acceptance status"
                }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            user: updatedUser
        }, { status: 200 })

    } catch (error) {
        console.error("Error updating user to accepting messages:", error)
        return Response.json({
            success: false,
            message: "Error updating user to accepting messages"
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Error verifying user session"
        }, { status: 401 })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages,
            message: "user found successfully",
            
        }, { status: 200 })

    } catch (error) {
        console.error("Error finding the User:", error)
        return Response.json({
            success: false,
            message: "Error Finding the User"
        }, { status: 500 })
    }
}