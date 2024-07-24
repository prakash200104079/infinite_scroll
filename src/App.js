import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ItemList from './components/ItemList';
import Loader from './components/Loader';
import './App.css'; // Import the CSS file

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    fetchItems();
  }, [page]);

  const fetchItems = async () => {
    if (loading) return; // Prevent fetching if already loading

    setLoading(true);

    try {
      // Simulate a 1-second delay
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve(axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=20`)), 1000)
      );

      // Check if items already exist to prevent duplicates
      const newItems = response.data;
      setItems(prevItems => {
        const existingIds = new Set(prevItems.map(item => item.id));
        const filteredNewItems = newItems.filter(item => !existingIds.has(item.id));
        return [...prevItems, ...filteredNewItems];
      });

      setHasMore(newItems.length > 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const isLoadingBarVisible = loading;

  return (
    <div>
      <h1 className="center-text">Infinite Scrolling</h1>
      <ItemList items={items} lastItemRef={lastItemRef} />
      {isLoadingBarVisible && <Loader />}
    </div>
  );
};

export default App;
