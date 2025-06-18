import { Link } from 'react-router-dom';

const Hello = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Hello World</h1>
      <Link
        to="/login"
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        Login
      </Link>
    </div>
  );
};

export default Hello;
