import  Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB();
        const formData = await req.formData();

        let events;
        try{
            events = Object.fromEntries(formData.entries());
        } catch(error){
            console.error('Error parsing form data:', error);
            return NextResponse.json({message:'Invalid form data'}, {status:400});
        }

        const file = formData.get('image') as File;
        if(!file) return NextResponse.json({message:'Image file is required'}, {status:400});

        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({message:'Invalid file type. Allowed: JPEG, PNG, WebP'}, {status:400});
        }
        if (file.size > MAX_SIZE) {
            return NextResponse.json({message:'File size exceeds 5MB limit'}, {status:400});
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult =await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvent'}, (error, result)=>{
                if(error) return reject(error);
                resolve(result);
            }).end(buffer);
        })
        
        if (!uploadResult.secure_url) {
            return NextResponse.json({message:'Cloudinary upload failed'}, {status:500});
        }

        const eventData = {
            title: events.title,
            description: events.description,
            date: events.date,
            image: uploadResult.secure_url,
            // Add other validated fields here
        };
        const createdEvent = await Event.create(eventData);
        return NextResponse.json({message:'Event created successfully', event: createdEvent}, {status:201});
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({message:'Event creation Failed', error: error instanceof Error ? error.message:'Unknown Error'}, {status:500});
    }
}

export async function GET(){
    try {
        await connectDB();
        const events = await Event.find().sort({createdAt:-1});
        return NextResponse.json({message:'Events fetched successfully', events}, {status:200});
    } catch (error) {
        return NextResponse.json({message:'Failed to fetch events', error: error instanceof Error ? error.message : 'Unknown Error'}, {status:500});
    }
}
