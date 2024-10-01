'use client'

import { useRouter } from "next/router"
import { useEffect } from "react";

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/")
        }, 2000);
    })

    return <div>You have been logged out...Redirecting in a second...</div>
}

export default LogoutPage;