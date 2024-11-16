import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { createClient } from "./supabase/client";

const useUser = () => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUserSession = async() => {
            const {data: { session }} = await supabase.auth.getSession();

            if(session){
                setUser(session.user);
            }else{
                router.push('/login')
            }
        }

        checkUserSession();
    }, [router]);

    return user;
}

export default useUser;