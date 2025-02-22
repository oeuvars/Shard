import { SearchIcon } from 'lucide-react'


type Props = {}

export const SearchInput = (props: Props) => {
  return (
    <form className='flex w-full max-w-[600px]'>
      <div className='relative w-full'>
         <input
            type='text'
            placeholder='Search'
            className='w-full h-full pl-4 pr-12 text-sm text-zinc-900 border focus:outline-none rounded-l-full'
         />
      </div>
      <button type='submit' className='px-5 py-2.5 bg-gray-100 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'>
         <SearchIcon className='size-5 my-auto'/>
      </button>
    </form>
  )
}
