import { Metadata } from "next"
import signupImage from "@/assets/signup-image.jpg"
import Image from "next/image"
import Link from "next/link"
import SigninForm from "./SigninForm"

export const metadata: Metadata = {
    title: "Sign Up"
}

export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center p-5">
            <div className="shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card">
                <div className="md:w-1/2 space-y-10 overflow-y-auto">
                    <div className="space-y-1 text-center">
                        <h1 className="text-3xl font-bold">Sign up to Bookverse</h1>
                    </div>
                    <div className="space-y-5">
                        <SigninForm/>
                        <Link href="/login" className="block-text-center hover:underline">
                          Already have an account? Log in
                        </Link> 
                    </div>
                </div>
                <Image 
                src={signupImage} 
                alt="signupImage" 
                className="hidden w-1/2 object-cover md:block"/>
            </div>
        </main>
    )
}