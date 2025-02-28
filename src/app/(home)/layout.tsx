import HomeLayout from '@/modules/home/ui/layouts/home-layout';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const dynamic = 'force-dynamic';

const Layout = ({ children }: Props) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
