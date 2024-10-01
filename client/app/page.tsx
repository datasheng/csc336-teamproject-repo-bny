import Profile from "@/components/left-sidebar/Profile";
import LoginButton from "@/components/LoginLoginOutButton";
import PostOptions from "@/components/main-section/PostOptions";
import StoryFeed from "@/components/main-section/StoryFeed";
import Follow from "@/components/right-sidebar/Follow";
import News from "@/components/right-sidebar/News";
import UserGreetText from "@/components/UserGreetText";

export default function Home() {
  return (
    <div className="">
      <UserGreetText/>
      <LoginButton/>
    </div>
  );
}
