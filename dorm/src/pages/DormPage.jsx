// src/pages/DormsPage.jsx
import React from 'react';
import DormList from '../components/DormList';

function DormsPage() {
  return (
    <div className="dorms-page">
      <h1>Список общежитий</h1>
      <DormList />
    </div>
  );
}

export default DormsPage;