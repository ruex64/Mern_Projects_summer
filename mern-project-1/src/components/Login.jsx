const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Sign in to Continue</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">UserName</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="yourUserName"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
