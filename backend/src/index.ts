import { Hono } from 'hono'
import {decode,sign,verify} from'hono/jwt';
import { blogRouter } from './routes/blog';
import { userRouter } from './routes/user';
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string
    JWT_SECRET:string
  }
}>()

// app.use('/api/v1/blog/*',async (c,next)=>{
//   const header=c.req.header("authorization") || "";
//   const token=header.split(" ")[1]
//   const response=verify(token,c.env.JWT_SECRET)
//   if(response.id){
//     next()
//   }else{
//     c.status(403)
//     return c.json({error:"unauthorized"})
//   }
  
  


// })


// app.post('/api/v1/signup', async (c) => {
//   const prisma=new PrismaClient({
//     datasourceUrl:c.env.DATABASE_URL,

//   }).$extends(withAccelerate());
// const body=await c.req.json();
// try{
//   const user= await prisma.user.create({
//     data:{
//       username:body.username,
//       password:body.password,
//     }
//   })
//   const jwt=await sign({
//     id:user.id
//   },c.env.JWT_SECRET)
//   return c.text(jwt)
// } catch(e){
//   console.log(e)
//   c.status(411);
//   return c.text('Invalid')
// }
 

  // const token=await sign({id:user.id},"secret")
  // return c.json({
  //   jwt:token
  // })
  


// app.post("/api/v1/signin",async (c)=>{
// const prisma=new PrismaClient({
//   datasourceUrl:c.env?.DATABASE_URL,
// }).$extends(withAccelerate());
// const body=await c.req.json();
// try{
// const user=await prisma.user.findUnique({
//   where:{
//     username:body.username,
//     password:body.password
//   }
// });
// if(!user){
//   c.status(403);
//   return c.json({error:"user not dound"});
// }
// const jwt=await sign({id:user.id},c.env.JWT_SECRET)
//   return c.json({jwt})
// }catch(e){
//   console.log(e);
//   c.status(411);
//   return c.text("Invalid");
// }
// })

// app.post("/api/v1/blog",(c)=>{
//   return c.text("hello hono")
// })

// app.put("/api/v1/blog",(c)=>{
//   return c.text("hello hono")
// })

// app.get("/api/v1/blog/:id",(c)=>{
//   return c.text("hello hono")
// })

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);



export default app




