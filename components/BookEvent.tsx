'use client';

import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react";

export default function BookEvent({eventId,slug}:{eventId:string,slug:string}){
    const [email,setEmail] = useState("");
    const [submitted,setSubmitted] = useState(false);
    const HandleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        const {success} = await createBooking({eventId,slug,email}); 
        if (success){
            setSubmitted(true);
            posthog.capture('event booked', {eventId,slug,email});
            console.log("Booking successful");
        } else{
            console.log("Booking failed");
            posthog.captureException("Booking failed");
        }
        
    }
    return(
        <div id='book-event'>
            {
                submitted ? (
                    <p className="text-sm">Thank you for signing up!</p>
                ):(
                    <form onSubmit={HandleSubmit}>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Enter your email address"
                                suppressHydrationWarning
                            />
                        </div>
                        <button type="submit" className="button-submit" suppressHydrationWarning>Submit</button>
                    </form>
                )
            }
            
        </div>
    )
}