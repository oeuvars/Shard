import React from 'react'
import { UserSection } from '../sections/user-sections';

type Props = {
   userId: string;
}

const UserView = ({ userId }: Props) => {
  return (
    <div className='flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6'>
      <UserSection userId={userId} />
    </div>
  )
}

export default UserView
