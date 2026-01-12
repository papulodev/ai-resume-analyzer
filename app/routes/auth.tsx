import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/pure';

export const meta = () => ([
  { title: 'Resume | Auth' },
  { name: 'description', content: 'Log into your account' },
])

function Auth() {

  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();

  const handleLogin = () => {
    if (auth.isAuthenticated) {
      auth.signOut();
    } else {
      auth.signIn();
    }
    navigate(next);
  }

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg p-2">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Bienvenido a Resume Analyzer</h1>
            <h2>Inicie sesión para continuar</h2>
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Iniciando sesión...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={handleLogin}>
                    <p>Salir</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={handleLogin}>
                    <p>Entrar</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth