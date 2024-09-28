import Link from "next/link";
import { CiBellOn } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { FaGear, FaHouse, FaNetworkWired } from "react-icons/fa6";
import { GiWorld } from "react-icons/gi";
import { LuMessageSquare } from "react-icons/lu";

const Profile = () => {
    const stats = [
        {
            name: "Post",
            count: 0,
        },
        {
            name: "Followers",
            count: 0
        },
        {
            name: "Following",
            count: 0
        }
    ]

    const menuItems = [
        {
            name: "Feed",
            icon: <FaHouse/>,
            link: "/"
        },
        {
            name: "Connections",
            icon: <FaNetworkWired/>,
            link: "/"
        },
        {
            name: "Latest News",
            icon: <GiWorld/>,
            link: "/news"
        },
        {
            name: "Events",
            icon: <FaCalendarAlt/>,
            link: "/events"
        },
        {
            name: "Groups",
            icon: <LuMessageSquare/>,
            link: "/"
        },
        {
            name: "Notifcations",
            icon: <CiBellOn/>,
            link: "/"
        },
        {
            name: "Settings",
            icon: <FaGear/>,
            link: "/"
        },
    ]

    return (
        <div className='hidden md:block min-w-xs bg-white rounded-lg shadow-lg p-6'>
            {/* Profile Image/Info */}
            <div className="flex flex-col items-center">
                <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="Profile Image" className='w-24 h-24 rounded-full shadow-lg'/>

                <h2 className='mt-4 text-xl font-semibold text-gray-800'>
                    Brandon Tjandra
                </h2>

                <p className='text-gray-500'>
                    Student @ The City College of New York
                </p>
            </div>

            {/* Bio */}
            <p className="mt-4 text-center text-gray-600 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nam dolor ab aperiam nobis quo, libero vero saepe maiores voluptas.
            </p>

            {/* Stats  */}
            <div className="mt-6 flex justify-around">
                {stats.map((stat, index) => {
                    return(
                        <div className="text-center" key={index}>
                            <span className="text-xl font-bold">{stat.count}</span>
                            <p className="text-sm text-gray-500">{stat.name}</p>
                        </div>
                    )
                })}
            </div>

            {/* Menu List */}
            <ul className="mt-6 space-y-4">
                {menuItems.map((menuItem, index) => {
                    return(
                        <li className="flex items-center justify-start space-x-2 text-gray-700" key={index}>
                            <Link href={menuItem.link}>
                                {menuItem.icon}

                                <span>{menuItem.name}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="mt-6 text-center">
                <Link href="/" className="text-blue-500 font-semibold">
                    View Profile
                </Link>
            </div>
        </div>
    )
}

export default Profile;
