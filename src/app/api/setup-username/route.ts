import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const { username } = await request.json();
        if (!username || username.length < 3) {
            return Response.json({ success: false, message: 'Username must be at least 3 characters' }, { status: 400 });
        }

        // Check if username is taken
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return Response.json({ success: false, message: 'Username is already taken' }, { status: 400 });
        }

        // Update the current user model
        const dbUser = await UserModel.findById(session.user._id);
        if (!dbUser) {
            return Response.json({ success: false, message: 'User not found in database' }, { status: 404 });
        }

        dbUser.username = username;
        await dbUser.save();

        return Response.json({ success: true, message: 'Username updated successfully' }, { status: 200 });
        
    } catch (error) {
        console.error('Error setting up username:', error);
        return Response.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
    }
}
