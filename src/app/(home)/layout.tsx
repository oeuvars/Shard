
import HomeLayout from '@/modules/home/ui/layouts/home-layout'
import React from 'react'

type Props = {
   children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
   <HomeLayout>
      {children}
   </HomeLayout>
  )
}

export default Layout
