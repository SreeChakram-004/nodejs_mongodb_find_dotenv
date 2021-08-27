import express from "express";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// const express = require("express");
// const {MongoClient}=require("mongodb");
const app= express();



const PORT=process.env.PORT;

async function createConnection(){
    const MONGO_URL=process.env.MONGO_URI;

const client= new MongoClient(MONGO_URL);
try{
    await client.connect();
    return client;
   console.log("successfully Connected");
}catch (err){
console.log(err);}
}


async function getPollById(client,id){
    const result=await client.db("contestants").collection("poll").findOne({id:id});
    console.log("success",result);
    return result;
}

async function getPolls(client,id){
    const result=await client.db("contestants").collection("poll").find({}).toArray();
    console.log("success",result);
    return result;
}

async function insertPoll(client,poll){
    const result=await client.db("contestants").collection("poll").insertMany(poll);
    console.log("insert successfully",result);
    return result;
}

createConnection();

app.get("/",(request,response)=>{
    response.send("Welcome to Node App")
});

app.get("/poll",async(request,response)=>{
    const client=await createConnection();
    const contestants=await getPolls(client);

    response.send(contestants);
});

app.get("/poll/:id",async(request,response)=>{
    const id=request.params.id;
    // const contestant=poll.filter((data)=>data.id===id);
    // console.log(contestant);
    const client= await createConnection();
    const contestant = await getPollById(client,id);
    response.send(contestant);
});

app.get("/poll/content/:search",async(request,response)=>{
    const search=request.params.search;
    const client=await createConnection();
    const contestants=await getPolls(client,{content:{$regex:search,$options:"i"},});
    response.send(contestants);
});
console.log("..hie");

app.listen(PORT,()=>console.log("server is started",PORT));