import { NextResponse } from "next/server";
import connectToDatabase from "./../../../../lib/db";
import DarkTruth from "../../../../models/UserVibes"; // Import User model
import User from "../../../../models/users"; // Import User model
 
export async function GET(req){
    try {
        console.log(req);
        await connectToDatabase()
        const darkTruths = await DarkTruth.find({});
        const userIds = darkTruths.map((item) => item.user);
        const userDetails = await User.find({ _id: { $in: userIds } });
        const userDetailsMap = {};
        userDetails.forEach((item) => {
            userDetailsMap[item._id]  = {
                email: item.email,
                gender: item.gender,
            };
        });
        // const responseData = darkTruths.map((darkTruth) => ({
        //     ...darkTruth._doc,
        //     userDetails: userDetailsMap[darkTruth.user] || null, // Attach user details
        // }));
        const responseData = darkTruths.map((darkTruth) => {
            const userDetailsForDarkTruth = userDetailsMap[darkTruth.user] || null;
            
            // If emailAllowed is false, remove the email from userDetails
            if (!darkTruth.emailAllowed) {
                delete userDetailsForDarkTruth.email;
            }

            return {
                ...darkTruth._doc,  // Spread original document
                userDetails: userDetailsForDarkTruth,  // Attach user details
            };
        });
       
         return NextResponse.json(
        {message:"hello bitches",darkTruths:responseData}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.error({message: error},{status: 500})
    }
}