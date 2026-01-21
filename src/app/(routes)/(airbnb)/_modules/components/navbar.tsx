import NavLeft from './navbar/nav-left'
import NavMain from './navbar/nav-main'
import NavRight from './navbar/nav-right'

export default function Navbar() {
  return (
    <div className='flex items-center justify-between pt-4 gap-2'>
        <NavLeft />

        <NavMain />

        <NavRight />
    </div>
  )
}
