const express=require("express");

const app=express();

app.use(express.json());


app.get('/',(req,res,next)=>{
  res.status(200).json("Hello World");
});

let PORT;
let port=PORT || 3000;

app.listen(port,()=>{
  console.log(`Your Port is running on port ${port}`);
});