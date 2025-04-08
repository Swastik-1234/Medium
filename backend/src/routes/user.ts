import { Hono } from "hono";
import {decode,sign,verify} from'hono/jwt';
import {signupInput} from "@swastik_010/medium-common"
import {z} from 'zod';
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string;
    }
}>();

userRouter.post('/signup', async (c) => {
  const prisma=new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,

  }).$extends(withAccelerate());
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    c.status(400);
    return c.json({ message: "Invalid JSON body" });
  }
  const parsed = signupInput.safeParse(body);
if(!parsed.success){
    c.status(411);
    return c.json({
        message:"inputs are incorrect"
    })
}
try{
  const user= await prisma.user.create({
    data:{
      username:body.username,
      password:body.password,
    }
  })
  const jwt=await sign({
    id:user.id
  },c.env.JWT_SECRET)
  return c.text(jwt)
} catch(e){
  console.log(e)
  c.status(411);
  return c.text('Invalid')
}
 

  // const token=await sign({id:user.id},"secret")
  // return c.json({
  //   jwt:token
  // })
  
})

userRouter.post("/signin",async (c)=>{
const prisma=new PrismaClient({
  datasourceUrl:c.env?.DATABASE_URL,
}).$extends(withAccelerate());
const body=await c.req.json();
try{
const user=await prisma.user.findUnique({
  where:{
    username:body.username,
    password:body.password
  }
});
if(!user){
  c.status(403);
  return c.json({error:"user not dound"});
}
const jwt=await sign({id:user.id},c.env.JWT_SECRET)
  return c.json({jwt})
}catch(e){
  console.log(e);
  c.status(411);
  return c.text("Invalid");
}
})