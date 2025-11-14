import  Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Helper to accept multiple possible client formats for list fields:
// - JSON array string: '["a","b"]'
// - Plain comma-separated string: 'a,b,c'
// - Newline-separated string
// - Single-element array containing a comma-separated string
function parseListField(raw: FormDataEntryValue | null): string[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean);
    if (typeof raw === 'string') {
        // Try JSON first
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean);
        } catch {
            // not JSON — fallthrough to other heuristics
        }

        // Prefer newline separators if present
        if (raw.includes('\n')) return raw.split('\n').map((s) => s.trim()).filter(Boolean);

        // Support a custom safe delimiter if client used it
        if (raw.includes('||')) return raw.split('||').map((s) => s.trim()).filter(Boolean);

        // Last resort: comma split (may split items that include commas)
        return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
}


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

        const tags = parseListField(formData.get('tags'));
        const agenda = parseListField(formData.get('agenda'));

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult =await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvent'}, (error, result)=>{
                if(error) return reject(error);
                resolve(result);
            }).end(buffer);
        })
        
        events.image= (uploadResult as {secure_url:string}).secure_url;
        const createdEvent = await Event.create({...events, tags:tags, agenda:agenda});
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
        return NextResponse.json({message:'Failed to fetch events',error:error}, {status:500});
    }
}



