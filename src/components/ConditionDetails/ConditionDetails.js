import React from "react";
import { useParams } from "react-router-dom";

const ConditionDetails = () => {
  const { code } = useParams();

  return (
    <div>
      <h1>Condition Details</h1>
      <h2>{code}</h2>
    </div>
  );
};

export default ConditionDetails;
