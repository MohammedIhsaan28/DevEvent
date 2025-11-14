import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem =({icon,alt,label}:{icon:string,alt:string,label:string})=>(
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda =({agendaItems}:{agendaItems:string[]})=>(
    <div className="agenda">
        <ul>
            {agendaItems.map((item,idx)=>(
                <li key={idx}>{item}</li>
            ))}
        </ul>

    </div>
)


const EventTags =({tags}:{tags:string[]})=>(
    <div className="flex flex-row gap-1.5 flex-wrap">
        <ul>
            {tags.map((tag,idx)=>(
                <div key={idx} className="pill">{tag}</div>
            ))}
        </ul>

    </div>
)
export default async function EventPage({params}:{params:Promise<{slug:string}>}) {
    const {slug} = await params;
    const res = await fetch(`${BASE_URL}/api/events/${slug}`);
    const {event:{description,image,overview,date,time,location,mode,agenda,audience,tags}} = await res.json()
    if(!description) return notFound();
    
// Normalize agenda into a simple string[]
let agendaItems: string[] = [];

if (Array.isArray(agenda) && agenda.length > 0) {
  // agenda[0] is one long string → split by ','
  agendaItems = agenda[0]
    .split(",")         // split into pieces
    .map((item) => item.trim()) // remove extra spaces
    .filter(item => item.length > 0); // remove empty strings
}


    

    return (
        <section id='event'>
            <div className="header">
                <h1>Event Descriptions</h1>
                <p>{description}</p>
            </div>
            <div className="details">
                {/* Left side Event Content */}
                <div className="content">
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />
                    <section className="flex-col gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>

                    </section>
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="Calendar Icon" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="Clock Icon" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="Pin Icon" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="Mode Icon" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="Audience Icon" label={audience} />

                    </section>
                    <EventAgenda agendaItems={agendaItems} />
                </div>

                {/* Right side Booking Form */}
                <aside className="booking">
                    <p className="text-lg font-semibold">Book Event</p>

                </aside>

            </div>
        </section>
    )
}
