import { NextFunction, Request, Response } from "express";


const verify = (req:Request, res:Response, next:NextFunction)=>{
console.log("Checking ID Card");

const ID=true;
if(!ID){
    throw new Error("Not Allowed");
}
next();

}

export default verify;