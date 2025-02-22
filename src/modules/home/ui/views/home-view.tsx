
import CategorySection from '../sections/category-section'

type Props = {
   categoryId?: string
}

const HomeView = ({ categoryId }: Props) => {
  return (
    <div className='max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 '>
      <CategorySection />
    </div>
  )
}

export default HomeView
