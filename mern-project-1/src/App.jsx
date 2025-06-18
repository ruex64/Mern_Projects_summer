import { Routes, Route } from 'react-router-dom';
import Hello from './components/Hello';
import Login from './components/Login';
import Success from './components/Success';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hello />} />
      <Route path="/login" element={<Login />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
};

export default App;
