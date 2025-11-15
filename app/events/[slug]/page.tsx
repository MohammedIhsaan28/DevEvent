import EventDetailsPage from "@/components/EventDetails";
import { Suspense } from "react";

export default async function EventPage({params}:{params:Promise<{slug:string}>}) {
    const slug = params.then((p)=> p.slug);
    return(
        <main> 
            <Suspense fallback={ <div>Loading...</div>}>
               <EventDetailsPage params={slug}/>
            </Suspense>
        </main>
    )
}
