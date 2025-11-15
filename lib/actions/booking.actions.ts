'use server';

import { Booking } from "@/database";
import connectDB from "../mongodb";



export async function createBooking({eventId,slug,email}:{eventId:string,slug:string,email:string}){
    try {
        await connectDB();
        await Booking.create({eventId,slug,email});
        console.log("Booking created successfully");
        
        return {success:true}
        
    } catch (e) {
       
        return {success:false}
    }
}