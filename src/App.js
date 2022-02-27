import './App.css';
import Footer from './components/Footer';
import HackerNewsList from './components/HackerNewsList';
import HackerFetchApi from './js/fetchApi';

function App() {
  return (
    <div className="App">
      <HackerNewsList api={new HackerFetchApi()} />
      <Footer />
    </div>
  );
}

export default App;
