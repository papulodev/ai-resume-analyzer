import { Link } from 'react-router'

function Navbar() {
  return (
    <nav className="navbar shadow-sm">
      <div className='flex-1'>
        <Link to="/">
          <p className="text-2xl font-bold text-gray-900">RESUMIND</p>
        </Link>
      </div>
      <div className="flex-none">
        <Link to="/upload" className="primary-button w-fit">
          Subir CV ó Resume
        </Link>
      </div>
    </nav>
  )
}

export default Navbar