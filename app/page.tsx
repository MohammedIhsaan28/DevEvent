import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Home() {
  const res = await fetch(`${BASE_URL}/api/events`);
  const {events} = await res.json();


  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev<br/>Event You Cannot Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, Workshops, and Conferences</p>
      <ExploreBtn/>
      <div className="mt-20 space-y-2">
      <h3>Featured Events</h3>
      <ul className="events list-none">

        {events && events.length>0 && events.map((event:IEvent)=>(
          <li key={event.title}>
          <EventCard {...event} />
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
