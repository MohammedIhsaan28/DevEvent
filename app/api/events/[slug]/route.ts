import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

type RouteParams = {
    params : Promise<{
        slug: string;
    }>
}

export async function GET(req:NextRequest,{params}:RouteParams){
    try{
        await connectDB();

        const {slug} = await params;

        if(!slug || typeof slug !== 'string' || slug.trim()===''){
            return NextResponse.json({
                message:'Invalid or missing slug parameter'
            },{status:400})
        }

        const sanitizeSlugs = slug.trim().toLowerCase();

        const event = await Event.findOne({slug:sanitizeSlugs}).lean();

        if(!event){
            return NextResponse.json({message:`Event with slug '${sanitizeSlugs}' not found`},{status:404});
        }

        return NextResponse.json({message:'Event fetched Successfully', event},{status:200});
    } catch(error){
        
        if(process.env.NODE_ENV==='development'){
            console.error('Error fetching event by slug:', error);
        }

        if(error instanceof Error){
            if(error.message.includes('MONGODB_URI')){
                return NextResponse.json({
                    message:'Database configurationn error'
                },{status:500});
            }

            return NextResponse.json({
                message:'An unexpected error occurred',
            },{status:500});
        }

    
    }
    

}
