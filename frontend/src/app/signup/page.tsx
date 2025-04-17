'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          nombre_usuario: name.toLowerCase().replace(/\s+/g, '_'), // ejemplo básico
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || 'Error al registrar usuario');
        return;
      }
  
      // ✅ Registro exitoso, redirigir al login
      alert('Registro exitoso, redirigiendo al login');
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/game', // o la ruta a la que quieras redirigir
      });
    } catch (err) {
      console.error('[REGISTER_ERROR]', err);
      setError('Error de conexión o del servidor');
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Crear Cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Registrar
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/login')}
          className="text-blue-600 hover:underline text-sm"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}
