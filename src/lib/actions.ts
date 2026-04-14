'use server'   
import {revalidatePath} from 'next/cache';
import {prisma} from "@/lib/prisma";
import {verifySession} from "@/lib/auth";
import {redirect} from "next/navigation";


export async function createTask(formData:FormData){

    const session=await verifySession();
    if(!session){
        redirect('/login');
    }
    const title =formData.get("title") as string;
    const description =formData.get("description") as string;

    if(!title.trim()){
        throw new Error("Title is required");
    }

    await prisma.task.create({
        data:{
            title:title.trim(),
            description:description?.trim() || null,
            userId:session.userId
        }
    });

    revalidatePath('/tasks');


}

export async function toggleTask(taskId:string){

    const session=await verifySession();
    if(!session){
        redirect('/login');
    }

    const task =await prisma.task.findFirst({
        where:{
            id:taskId,
            userId:session.userId
        }
    })

      if (!task) return { error: 'Task not found' };

      await prisma.task.update({
        where:{
            id:taskId
        },
        data:{
            completed:!task.completed
        }
      })

      revalidatePath('/tasks');

  
    
}

export async function deleteTask(taskId:string){

    const session=await verifySession();
    if(!session){
        redirect('/login');
    }

    await prisma.task.deleteMany({
        where:{
            id:taskId,
            userId:session.userId
        }
    });

      revalidatePath('/tasks');

  
    
}
