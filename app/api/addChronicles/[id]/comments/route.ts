import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserVibesModel from "@/models/chroniclesSchema";
import { verifyToken } from "@/utils/auth"; // Adjust path as needed
import User from "@/models/users";
import sanitizeHtml from "sanitize-html";
import { commentSchema } from "@/lib/validationSchemas";
interface RequestBody {
  user: {
    userId?: string;
    name?: string;
  };
  comment: string;
  createdAt?: Date;
}
interface UserDocument {
  _id: string;
  email: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params; // <-- fixed this line only
    const body: RequestBody = await request.json();
    const { comment } = body;
    const safeComment = sanitizeHtml(comment, {
      allowedTags: [], // remove all HTML tags
      allowedAttributes: {},
    });
 
    if (!safeComment.trim()) {
      return NextResponse.json(
        { message: "comment cannot be empty or contain only HTML tags" },
        { status: 400 }
      );
    }
    const parsed = commentSchema.safeParse({ comment: safeComment });
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Please Subscribe to get all convo" },
        { status: 404 }
      );
    }
    console.log(token);

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
    console.log(userData);

    const getUser = (await User.findById(
      userData.userId
    )) as UserDocument | null;
    console.log(getUser, "getUser");
    if (!getUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const findPost = await UserVibesModel.findById(id);
    if (!findPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    console.log(findPost);

    findPost.UserComments.push({
      user: {
        userId: getUser._id,
        name: getUser.email,
      },
      comment: safeComment, // save sanitized comment
      createdAt: body.createdAt || new Date(),
    });

    await findPost.save();
    return NextResponse.json(
      {
        message: "Comment Added Successfully",
        user: {
          userId: getUser._id,
          name: getUser.email,
          comment: safeComment, // <- use sanitized comment here
          createdAt: body.createdAt || new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params; // <-- fixed this line only

     const { searchParams } = new URL(request.url);
    const Cid = searchParams.get("Cid");
    console.log(Cid, "Cid");
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "token not found" }, { status: 404 });
    }
    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ message: "please login" }, { status: 401 });
    }
    const findPost = await UserVibesModel.findById(id);
    if (!findPost) {
      return NextResponse.json({ message: "post not found" }, { status: 401 });
    }
    const updatedChronicle = await UserVibesModel.findByIdAndUpdate(
      id,
      { $pull: { UserComments: { _id: Cid } } },
      { new: true }
    );

    if (!updatedChronicle) {
      return NextResponse.json(
        { success: false, message: "Chronicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      updatedChronicle,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
