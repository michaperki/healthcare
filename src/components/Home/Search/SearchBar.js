import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDatabase, ref, child, get } from 'firebase/database'; // Import the Realtime Database functions
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

  const handleItemClick = async (condition) => {
    try {
      // Fetch the corresponding CPT code from the Realtime Database
      const db = getDatabase();
      const cptCodeRef = ref(db, `CPTCodes/${condition.CODE}/cptCode`);
      const cptCodeSnapshot = await get(cptCodeRef);
      const cptCode = cptCodeSnapshot.val();

      // Navigate to the selected item's page with the fetched CPT code as a parameter
      navigate(`/condition/${cptCode}`);
    } catch (error) {
      console.error('Error fetching CPT code:', error);
    }
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
