import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HackerNews from './views/HackerNews';
import ErrorPage from './views/ErrorPage';
import HackerStory from './views/HackerStory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HackerNews />} />
        <Route path="/news/:author" element={<HackerNews />} />
        <Route path="/story/:id" element={<HackerStory />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
