import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(req:NextRequest){

    try{
          const {email,password}=await req.json();
          const user =await prisma.user.findUnique({where:{email}});

          if(!user){
            return NextResponse.json({error:"Invalid credentials"},{status:404});
          }

          const valid =await bcrypt.compare(password,user.password);
          if(!valid){
            return NextResponse.json({error:"Invalid credentials"},{status:404});
          }

          await createSession({userId:user.id,email:user.email});
          return NextResponse.json({message:"Login successful"});
        
    }catch(err){
        console.error("Login error:", err);
        return NextResponse.json({error:"Internal server error"},{status:500});
    }

    }
