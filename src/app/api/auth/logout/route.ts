
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(){



    try{
        await deleteSession();
        return NextResponse.json({message:"Logout successful"});



    }catch(err){

        console.error("Logout error:", err);
        return NextResponse.json({error:"Internal server error"},{status:500});

    }

}