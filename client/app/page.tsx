import Profile from "@/components/left-sidebar/Profile";
import PostOptions from "@/components/main-section/PostOptions";
import StoryFeed from "@/components/main-section/StoryFeed";
import Follow from "@/components/right-sidebar/Follow";
import News from "@/components/right-sidebar/News";
import Image from "next/image";
import { FaPhotoVideo } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gray-100 grid grid-cols-4 gap-10 p-4 min-h-screen">
      {/*Left Sidebar*/}
      <div className="row-span-3">
        <Profile/>
      </div>

      {/*Middle Section*/}
      <div className="col-span-2">
        <StoryFeed/>
        <PostOptions/>
      </div>

      {/*Middle Section*/}
      <div className="row-span-3">
        <Follow/>
        <News/>
      </div>
    </div>
  );
}
