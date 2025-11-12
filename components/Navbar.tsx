import Link from "next/link";
import Image from "next/image";
export default function Navbar(){
    return(
        <header>
            <nav>
                <Link href="/" className="logo">
                <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
                <p>DevEvent</p>
                </Link>
                <ul>
                    <li><Link href='/'>Home</Link></li>
                    <li><Link href='/'>About</Link></li>
                    <li><Link href='/'>Create Events</Link></li>
                </ul>            </nav>
        </header>
    )
}