import Profile from "@/components/left-sidebar/Profile";
import PostOptions from "@/components/main-section/PostOptions";
import StoryFeed from "@/components/main-section/StoryFeed";
import Follow from "@/components/right-sidebar/Follow";
import News from "@/components/right-sidebar/News";

export default function Home() {
  return (
    <div className="grid-cols-1 bg-gray-100 lg:grid lg:grid-cols-4 gap-10 p-4 min-h-screen">
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
        <div className="sm:row-span-3">
          <Follow/>
          <News/>
        </div>
    </div>
  );
}
