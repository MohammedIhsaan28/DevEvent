import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";

const booking = 10;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_BASE_URL environment variable is not configured"
  );
}
const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <ul>
      {agendaItems.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: 'no-store', // or appropriate caching strategy
  });
  
  if (!res.ok) {
    return notFound();
  }
  
  const data = await res.json();
  
  if (!data?.event) {
    return notFound();
  }
  
  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = data.event;  if (!description) return notFound();

  // Normalize agenda into a simple string[]
  let agendaItems: string[] = [];

  if (
    Array.isArray(agenda) &&
    agenda.length > 0 &&
    typeof agenda[0] === "string"
  ) {
    // agenda[0] is one long string → split by ','
    agendaItems = (agenda[0] as string)
      .split(",") // split into pieces
      .map((item: string) => item.trim()) // remove extra spaces
      .filter((item: string) => item.length > 0); // remove empty strings
  }

  let tagsItems: string[] = [];

  if (Array.isArray(tags) && tags.length > 0 && typeof tags[0] === "string") {
    // tags[0] is one long string → split by ','
    tagsItems = (tags[0] as string)
      .split(",") // split into pieces
      .map((item: string) => item.trim()) // remove extra spaces
      .filter((item: string) => item.length > 0); // remove empty strings
  }

  return (
    <section id="event">
      <div className="header">
        <h1>Event Descriptions</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* Left side Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Calendar Icon"
              label={date}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="Clock Icon"
              label={time}
            />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="Pin Icon"
              label={location}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="Mode Icon"
              label={mode}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="Audience Icon"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agendaItems} />

          <section className="flex-col-gap-2">
            <h2>Event Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tagsItems} />
        </div>

        {/* Right side Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>

            {
                booking > 0 ?(
                    <p className="text-sm">
                        Join {booking} people who have already booked their spot!
                    </p>
                ):(
                    <p className="text-sm"> Be the first to book your spot!</p>
                )
            }
            <BookEvent/>

          </div>
        </aside>
      </div>
    </section>
  );
}

