import { Hono } from "hono";
import {decode,sign,verify} from'hono/jwt';

import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
export const blogRouter=new Hono<{
   Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;

   },
   Variables:{
    userId:string;
   }
}
   >()

   blogRouter.use("/*",async (c,next)=>{
    const authHeader=c.req.header("authorization")|| "";
    try{
    const user=await verify(authHeader,c.env.JWT_SECRET);
    if(user){
        c.set("userId",user.id);
        await next();
    }
   
    else{
        c.status(403);
        return c.json({
            message:"you are not logged in"
        })
    }
}catch(e){
    c.status(403);
    return c.json({
        mesage:"you are not logged in"
    })
}
    
   })

   blogRouter.post('/',async (c)=>{
    const body=await c.req.json();
     const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    
      }).$extends(withAccelerate());
      const userId=c.get("userId");
     const blog= await prisma.blog.create({
        data:{
        title:body.title,
        content:body.content,
        authorId: userId
      }
      })
    return c.json({
        id:blog.id
    })
   })

   blogRouter.put('/',async(c)=>{
    const body=await c.req.json();
    const prisma=new PrismaClient({
       datasourceUrl:c.env.DATABASE_URL,
   
     }).$extends(withAccelerate());
     const blog=await prisma.blog.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content
        }
     })
    
    return c.text("hello hono")
   })

   blogRouter.get('/bulk',async  (c)=>{
   
    const prisma=new PrismaClient({
       datasourceUrl:c.env.DATABASE_URL,
   
     }).$extends(withAccelerate());
    const blogs= await prisma.Blog.findMany();
    return c.json({
        blogs
    })
   })

   blogRouter.get('/:id',async (c)=>{
    const id=await c.req.param("id");
    const prisma=new PrismaClient({
       datasourceUrl:c.env.DATABASE_URL,
   
     }).$extends(withAccelerate());
     try{
     const blog=await prisma.blog.findFirst({
        where:{
            id:Number(id)
        }
     })
    return c.json({
        blog
    })
}catch(e){
    c.status(411);
    console.log(e)
    return c.json({
        medsage:"error while fetching blog post"
    })
}
   })

   