import { useState } from 'react';
import { dishList } from './data.js';
export default function Menu() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex((index + 1) % dishList.length); // revient au début
  }

  function handlePrevClick() {
    setIndex((index - 1 + dishList.length) % dishList.length);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let dish = dishList[index];

  return (
    <section style={styles.card}>
      <div style={styles.country}>
        <img 
          src={`https://flagcdn.com/w40/${dish.isoCode.toLowerCase()}.png`} 
          alt={dish.country}
          style={{ width: '24px', verticalAlign: 'middle', marginRight: '8px' }}
        />
        {dish.country}
      </div>
      <img
        src={dish.url}
        alt={dish.alt}
        style={styles.image}
      />
      <h2 style={styles.name}>{dish.name}</h2>
      <p style={styles.counter}>
        Plat {index + 1} / {dishList.length}
      </p>
      <button onClick={handleMoreClick} style={styles.btnDetails}>
        {showMore ? '🙈 Masquer' : '📖 Voir les détails'}
      </button>
      {showMore && <p style={styles.description}>{dish.description}</p>}
      <div style={styles.navButtons}>
        <button onClick={handlePrevClick} style={styles.btn}>⬅ Précédent</button>
        <button onClick={handleNextClick} style={styles.btn}>Suivant ➡</button>
      </div>
    </section>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '400px',
    margin: '20px auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  name: {
    fontSize: '22px',
    color: '#333',
    margin: '10px 0 4px',
  },
  country: {
    fontSize: '16px',
    color: '#e67e22',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  counter: {
    color: '#999',
    fontSize: '13px',
  },
  description: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6',
    marginTop: '10px',
    textAlign: 'left',
  },
  navButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  btn: {
    background: '#e67e22',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnDetails: {
    background: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '8px',
  },
};