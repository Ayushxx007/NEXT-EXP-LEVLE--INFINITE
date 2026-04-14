import 'server-only'  ;
import { SignJWT,jwtVerify } from "jose";
import { cookies } from "next/headers";


const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);


export type JWTPayload={
    userId: string;
    email: string;
  
}




export async function createSession(payload:JWTPayload){
    
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
    
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });


    
}

export async function verifySession():Promise<JWTPayload | null>{

    try{

        const cookieStore =await cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return null;
        }

        const {payload} = await jwtVerify(token, secret);
        return payload as unknown as  JWTPayload;

    }catch{
        return null;
    }

    
}



export const deleteSession = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}

