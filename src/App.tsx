import { useState, useEffect } from 'react';
import WishCreator from './components/WishCreator';
import WishViewer from './components/WishViewer';
import { decodeWish } from './utils/urlEncoder';
import type { WishData } from './types/wish';
import './App.css';

function App() {
  const [wish, setWish] = useState<WishData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wishParam = params.get('w');
    if (wishParam) {
      const decoded = decodeWish(wishParam);
      if (decoded) {
        setWish(decoded);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-stage">
        <div className="loading-spinner"></div>
        <p>Loading your special surprise...</p>
      </div>
    );
  }

  if (wish) {
    return <WishViewer wish={wish} />;
  }

  return <WishCreator />;
}

export default App;
export { App };
