import React, { useState } from 'react';
import '../css/MBTI.css';

const mbtiTypes = {
    INTJ: 'Architect',
    INTP: 'Logician',
    ENTJ: 'Commander',
    ENTP: 'Debater',
    INFJ: 'Advocate',
    INFP: 'Mediator',
    ENFJ: 'Protagonist',
    ENFP: 'Campaigner',
    ISTJ: 'Logistician',
    ISFJ: 'Defender',
    ESTJ: 'Executive',
    ESFJ: 'Consul',
    ISTP: 'Virtuoso',
    ISFP: 'Adventurer',
    ESTP: 'Entrepreneur',
    ESFP: 'Entertainer',
};

const mbtiGroups = {
    Analysts: { color: 'rgb(162, 0, 255)', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] }, // Purple
    Diplomats: { color: 'rgb(11, 138, 0)', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] }, // Green
    Sentinels: { color: 'rgb(3, 206, 252)', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] }, // Blue
    Explorers: { color: 'rgb(252, 186, 3)', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] }  // Yellow
};
  
  const MBTI = () => {
    const [selectedType, setSelectedType] = useState('');
  
    const handleSelectType = (typeCode) => {
      setSelectedType(typeCode);
    };
  
    return (
        <div className="mbti-container">
          <h1>Select Your MBTI Personality Type</h1>
          {Object.entries(mbtiGroups).map(([groupName, groupDetails]) => (
            <div key={groupName}>
              <h2 style={{ color: groupDetails.color }}>{groupName}</h2>
              <div className="mbti-cards">
                {groupDetails.types.map((typeCode) => (
                  <div 
                    key={typeCode} 
                    className={`mbti-card ${selectedType === typeCode ? 'selected' : ''}`}
                    onClick={() => handleSelectType(typeCode)}
                    style={{ backgroundColor: groupDetails.color, borderColor: groupDetails.color }}
                  >
                    <h2>{typeCode}</h2>
                    <p>{mbtiTypes[typeCode]}</p> 
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    };
    
    export default MBTI;
