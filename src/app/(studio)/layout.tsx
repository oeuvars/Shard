import StudioLayout from '@/modules/studio/ui/layouts/studio-layout'
import { ReactNode } from 'react'

type Props = {
   children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
   <StudioLayout>
      {children}
   </StudioLayout>
  )
}

export default Layout
