import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "../../types"
import { authClient } from "@/lib/auth-client";

type Props = {
   user: UserGetOneOutput;
}

const UserBanner = ({ user }: Props) => {

  const session = authClient.useSession();
  const userId = session.data?.user.id

  return (
    <div className="relative group">
      <div
        className={cn("w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-xl", user.bannerUrl ? "bg-cover bg-center" : "bg-neutral-100")}
        style={{ backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined}}
      >

      </div>
    </div>
  )
}

export default UserBanner
