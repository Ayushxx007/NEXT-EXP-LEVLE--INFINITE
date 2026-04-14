import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import {createSession} from "@/lib/auth";



export async function POST(req:NextRequest){

    try{
        const {name,email,password}=await req.json();

        if(!name || !email || !password){
            return NextResponse.json({error:"all fields required"},{status:400});
        }

        const existing= await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(existing){
              return NextResponse.json({error:"email already in use "},{status:400});

        }

        const hashed =await bcrypt.hash(password,12);
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password:hashed
            }
        });

        await createSession({userId:user.id,email:user.email});

        return NextResponse.json({success:true,userId:user.id},{status:201});;

    }catch(err){
        console.log(err);
          return NextResponse.json({error:"internal server error"},{status:201});;

    }

}
