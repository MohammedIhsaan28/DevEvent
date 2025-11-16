# DevEvent

A modern event management platform built with Next.js, TypeScript, MongoDB, and Tailwind CSS. Discover, explore, and book tech events—hackathons, meetups, workshops, and conferences.


## Features

- **Event Discovery**: Browse and search upcoming tech events
- **Event Details**: View comprehensive event information including agenda, organizer details, and tags
- **Event Booking**: Reserve your spot at events with email confirmation
- **Similar Events**: Discover related events based on tags
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Server-side Caching**: Optimized performance with Next.js caching


## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Image Storage**: Cloudinary
- **Analytics**: PostHog (optional)
- **Form Handling**: FormData API with multipart/form-data support

## Project Structure

```
DevEvent/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page with featured events
│   ├── api/
│   │   └── events/
│   │       ├── route.ts        # GET/POST events endpoints
│   │       └── [slug]/
│   │           └── route.ts    # GET event by slug endpoint
│   └── events/
│       └── [slug]/
│           └── page.tsx        # Event detail page
├── components/
│   ├── EventCard.tsx           # Event card component
│   ├── EventDetails.tsx        # Event details component
│   ├── BookEvent.tsx           # Booking form component
│   ├── Navbar.tsx              # Navigation bar
│   ├── ExploreBtn.tsx          # Explore button
│   └── LightRays.tsx           # Decorative component
├── database/
│   ├── event.model.ts          # Event Mongoose schema
│   ├── booking.model.ts        # Booking Mongoose schema
│   └── index.ts                # Database exports
├── lib/
│   ├── mongodb.ts              # MongoDB connection
│   ├── constants.ts            # App constants
│   ├── utils.ts                # Utility functions
│   └── actions/
│       ├── event.actions.ts    # Event server actions
│       └── booking.actions.ts  # Booking server actions
├── public/
│   ├── icons/                  # Icon assets
│   └── images/                 # Image assets
├── types/
│   └── css.d.ts                # CSS module types
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DevEvent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   
   # Base URL (for local dev or production)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # PostHog (optional)
   NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-key>
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Events

- **GET `/api/events`** - Fetch all events (sorted by creation date)
- **POST `/api/events`** - Create a new event (requires form data with image upload)
- **GET `/api/events/[slug]`** - Fetch event by slug

### Event Creation (POST)

**Request**: `multipart/form-data`

```javascript
const formData = new FormData();
formData.append('title', 'Event Title');
formData.append('description', 'Event description');
formData.append('overview', 'Brief overview');
formData.append('venue', 'Venue name');
formData.append('location', 'Location');
formData.append('date', '2025-12-25');
formData.append('time', '09:00');
formData.append('mode', 'hybrid'); // 'online', 'offline', 'hybrid'
formData.append('audience', 'Target audience');
formData.append('organizer', 'Organizer name');
formData.append('tags', JSON.stringify(['tag1', 'tag2']));
formData.append('agenda', JSON.stringify(['item1', 'item2']));
formData.append('image', fileInput.files[0]);

const res = await fetch('/api/events', { method: 'POST', body: formData });
```

## Database Schemas

### Event

```typescript
{
  title: string (required, max 100 chars)
  slug: string (unique, auto-generated from title)
  description: string (required, max 1000 chars)
  overview: string (required, max 500 chars)
  image: string (URL, required)
  venue: string (required)
  location: string (required)
  date: string (ISO format, required)
  time: string (HH:MM format, required)
  mode: 'online' | 'offline' | 'hybrid' (required)
  audience: string (required)
  agenda: string[] (required, min 1 item)
  organizer: string (required)
  tags: string[] (required, min 1 tag)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Booking

```typescript
{
  eventId: ObjectId (ref: Event, required)
  email: string (required, valid email format)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

Unique constraint: One booking per event per email.

## Key Features Explained

### Server Components & Data Fetching

- Home page (`app/page.tsx`) and event details (`components/EventDetails.tsx`) are server components
- Data is fetched directly from MongoDB using `.lean()` for plain objects
- Uses `'use cache'` directive with `cacheLife('hours')` for optimal performance
- Avoids unnecessary HTTP round-trips

### Form Handling

- Event creation uses `multipart/form-data` for file uploads
- `parseListField()` helper safely parses tags and agenda from various input formats
- Cloudinary integration for reliable image storage

### Booking System

- Server action: `createBooking()` in `lib/actions/booking.actions.ts`
- Validates eventId and email before DB insert
- Returns serialized error objects (not Error instances) for client components
- Handles duplicate bookings (unique constraint on eventId + email)

### Error Handling

- Mongoose validation errors are serialized to plain objects
- Database connection errors are caught and logged
- Client receives user-friendly error messages

## Development Notes

### Known Patterns

1. **Avoid passing Error objects to client components** — serialize error messages instead
2. **Use `.lean()` for Mongoose queries** — returns plain objects safe for client components
3. **Fetch data server-side** — pass results as plain JSON to client components
4. **Use server actions for mutations** — marked with `'use server'` directive

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Invalid URL in fetch | Ensure `NEXT_PUBLIC_BASE_URL` includes protocol (http:// or https://) |
| "Uncached data accessed outside Suspense" | Fetch data in server component and pass as props to client components |
| Mongoose duplicate index warnings | Remove duplicate index definitions in schema |
| "Only plain objects can be passed to Client Components" | Use `.lean()`, `.toObject()`, or serialize errors to plain objects |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Future Enhancements

- [ ] User authentication (signup/login)
- [ ] User profiles and booking history
- [ ] Event search and filtering by date, location, tags
- [ ] Email notifications for bookings
- [ ] Event reviews and ratings
- [ ] Payment integration for paid events
- [ ] Admin dashboard for event management
- [ ] Calendar view for events

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add your feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request


## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ using Next.js, MongoDB, and Tailwind CSS**
