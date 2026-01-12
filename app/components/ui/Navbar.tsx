import { Link, useNavigate } from 'react-router'
import { usePuterStore } from '~/lib/pure';

function Navbar() {

  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/auth');
  }

  return (
    <nav className="navbar shadow-sm z-20">
      <div className='flex-1'>
        <Link to="/">
          <p className="text-2xl font-bold text-gray-900">RESUME ANALYZER</p>
        </Link>
      </div>
      <div className="flex-none">
        <button onClick={handleLogout} className="primary-button w-fit">
          Cerrar sesion
        </button>
      </div>
    </nav>
  )
}

export default Navbar