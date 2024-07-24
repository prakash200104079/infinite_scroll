import React from 'react';
import './ItemList.css';

const ItemList = ({ items, lastItemRef }) => {
  return (
    <div className="item-list">
      {items.map((item, index) => (
        <div key={item.id} ref={index === items.length - 1 ? lastItemRef : null} className="item">
          <h1>{item.id}</h1>
          <h2>{item.title}</h2>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
