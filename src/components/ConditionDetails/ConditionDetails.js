import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, child, get } from "firebase/database";

const ConditionDetails = () => {
  const { code } = useParams();
  const [priceDetails, setPriceDetails] = useState(null);
  const [hospital, setHospital] = useState("Baylor Scott & White"); // Default hospital name, change as needed
  const [hospitalId, setHospitalId] = useState("001"); // Default hospital ID, change as needed
  const [insurer, setInsurer] = useState("SELF_PAY"); // Default insurer, change as needed
  const [hospitals, setHospitals] = useState([]); // List of hospitals fetched from the database

  useEffect(() => {
    const fetchPriceDetails = async () => {
      // Fetch the cptCodeId for the selected CPT code from the CPTCodes node
      const db = getDatabase();
      const cptCodesRef = ref(db, "CPTCodes");
      const cptCodesSnapshot = await get(cptCodesRef);
      const cptCodesData = cptCodesSnapshot.val();

      // Find the cptCodeId for the selected CPT code
      const selectedCptCodeId = Object.keys(cptCodesData).find(
        (cptCodeId) => cptCodesData[cptCodeId].cptCode === code
      );

      if (selectedCptCodeId) {
        // If the cptCodeId is found, proceed with fetching the price data
        const hospitalPricesRef = ref(
          db,
          `HospitalPrices/${hospitalId}/${selectedCptCodeId}/${insurer}`
        );

        try {
          const priceSnapshot = await get(hospitalPricesRef);
          const priceData = priceSnapshot.val();
          setPriceDetails(priceData);
        } catch (error) {
          console.error("Error fetching price details:", error);
        }
      } else {
        // If the cptCodeId is not found, set priceDetails to null (price not available)
        setPriceDetails(null);
      }
    };

    fetchPriceDetails();
  }, [code, hospitalId, insurer]);

  useEffect(() => {
    // Fetch the list of hospitals for the dropdown
    const fetchHospitals = async () => {
      const db = getDatabase();
      const hospitalsRef = ref(db, "Hospitals");

      try {
        const hospitalsSnapshot = await get(hospitalsRef);
        const hospitalsData = hospitalsSnapshot.val();
        setHospitals(Object.values(hospitalsData)); // Convert object values to an array of hospitals
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const handleHospitalChange = async (e) => {
    const selectedHospital = e.target.value;
    setHospital(selectedHospital);

    // Fetch the hospital ID based on the selected hospital name
    const db = getDatabase();
    const hospitalsRef = ref(db, "Hospitals");
    const hospitalSnapshot = await get(hospitalsRef);
    const hospitalsData = hospitalSnapshot.val();
    const selectedHospitalId = Object.keys(hospitalsData).find(
      (hospitalId) => hospitalsData[hospitalId].hospitalName === selectedHospital
    );
    setHospitalId(selectedHospitalId);
  };

  const handleInsurerChange = (e) => {
    const selectedInsurer = e.target.value;
    setInsurer(selectedInsurer);
  };

  // Render condition details and price data
  return (
    <div>
      <h2>Condition Details</h2>
      <p>CPT Code: {code}</p>

      {/* Hospital dropdown */}
      <div>
        <label htmlFor="hospitalSelect">Select Hospital:</label>
        <select id="hospitalSelect" value={hospital} onChange={handleHospitalChange}>
          {hospitals.map((hospital) => (
            <option key={hospital.hospitalId} value={hospital.hospitalName}>
              {hospital.hospitalName}
            </option>
          ))}
        </select>
      </div>

      {/* Insurer dropdown */}
      <div>
        <label htmlFor="insurerSelect">Select Insurer:</label>
        <select id="insurerSelect" value={insurer} onChange={handleInsurerChange}>
          <option value="SELF_PAY">Self Pay</option>
          <option value="AETNA">Aetna</option>
          <option value="CIGNA">Cigna</option>
        </select>
      </div>

      {priceDetails ? (
        <div>
          <h3>Hospital ID: {hospitalId}</h3>
          <h3>Insurer: {insurer}</h3>
          <h3>Price: {priceDetails.price}</h3>
        </div>
      ) : (
        <p>Price not available for the selected combination.</p>
      )}
    </div>
  );
};

export default ConditionDetails;
