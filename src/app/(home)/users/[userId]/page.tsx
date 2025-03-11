import UserView from '@/modules/users/ui/views/user-view';
import { HydrateClient, trpc } from '@/trpc/server/server';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export const dynamic = "force-dynamic"

const Page = async ({ params }: Props) => {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ id: userId })

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;
