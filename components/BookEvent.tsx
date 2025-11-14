'use client';

import { useState } from "react";

export default function EventPage(){
    const [email,setEmail] = useState("");
    const [submitted,setSubmitted] = useState(false);
    const HandleSubmit =(e:React.FormEvent)=>{
        e.preventDefault();
        setTimeout(()=>{
            setSubmitted(true);
        },1000);
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
                        <button type="submit" className="button-submit">Submit</button>
                    </form>
                )
            }
            
        </div>
    )
}