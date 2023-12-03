import React, { useState } from 'react';
import '../css/MBTI.css';

const MBTI = () => {
  const [mbtiType, setMbtiType] = useState('');

  const handleMbtiChange = (event) => {
    setMbtiType(event.target.value);
  };

  return (
    <div className="mbti-container">
      <h1>Select Your MBTI Personality Type</h1>
      <select value={mbtiType} onChange={handleMbtiChange} className="mbti-select">
        <option value="">--Select Type--</option>
        <option value="INTJ">INTJ - Architect</option>
        <option value="INTP">INTP - Logician</option>
        <option value="ENTJ">ENTJ - Commander</option>
        <option value="ENTP">ENTP - Debater</option>
        <option value="INFJ">INFJ - Advocate</option>
        <option value="INFP">INFP - Mediator</option>
        <option value="ENFJ">ENFJ - Protagonist</option>
        <option value="ENFP">ENFP - Campaigner</option>
        <option value="ISTJ">ISTJ - Logistician</option>
        <option value="ISFJ">ISFJ - Defender</option>
        <option value="ESTJ">ESTJ - Executive</option>
        <option value="ESFJ">ESFJ - Consul</option>
        <option value="ISTP">ISTP - Virtuoso</option>
        <option value="ISFP">ISFP - Adventurer</option>
        <option value="ESTP">ESTP - Entrepreneur</option>
        <option value="ESFP">ESFP - Entertainer</option>
      </select>
    </div>
  );
};

export default MBTI;
