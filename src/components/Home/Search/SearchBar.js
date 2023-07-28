import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { NavLink, useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditions, setConditions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConditions = async () => {
      const conditionsRef = collection(firestore, 'MedicalConditions');
      const q = query(conditionsRef, where('CONDITION', '>=', searchTerm));

      try {
        const snapshot = await getDocs(q);
        const conditionsData = snapshot.docs.map((doc) => doc.data());
        setConditions(conditionsData);
      } catch (error) {
        console.error('Error fetching conditions:', error);
      }
    };

    if (searchTerm) {
      // Fetch conditions only if the search term is not empty
      fetchConditions();
    } else {
      // Clear conditions if the search term is empty
      setConditions([]);
    }
  }, [searchTerm]);

  const handleItemClick = (condition) => {
    // Navigate to the selected item's page
    navigate(`/condition/${condition.CODE}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for Medical Conditions"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {conditions.length > 0 && (
        <div className="dropdown">
          {conditions.map((condition) => (
            <div
              key={condition.CODE}
              className="dropdown-item"
              onClick={() => handleItemClick(condition)}
            >
              {condition.CONDITION} (Code: {condition.CODE})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
