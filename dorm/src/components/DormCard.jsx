// src/components/DormCard.jsx
import React from 'react';
import './DormCard.css';

function DormCard({ dorm, isExpanded, onExpand }) {
  return (
    <div className={`dorm-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header">
        <h3>{dorm.name}</h3>
        <p className="address">{dorm.address}</p>
      </div>
      
      {isExpanded && (
        <div className="dorm-details">
          <div className="detail-item">
            <span className="detail-label">Проживают:</span>
            <span className="detail-value">{dorm.students}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Характеристика:</span>
            <span className="detail-value">{dorm.description}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Мест:</span>
            <span className="detail-value">{dorm.capacity}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Заведующий:</span>
            <span className="detail-value">{dorm.manager}</span>
          </div>
          {dorm.email && (
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{dorm.email}</span>
            </div>
          )}
          {dorm.phone && (
            <div className="detail-item">
              <span className="detail-label">Телефон:</span>
              <span className="detail-value">{dorm.phone}</span>
            </div>
          )}
        </div>
      )}
      
      <button onClick={onExpand} className="details-button">
        {isExpanded ? (
          <>
            <span>Свернуть</span>
            <span className="icon">↑</span>
          </>
        ) : (
          <>
            <span>Подробнее</span>
            <span className="icon">↓</span>
          </>
        )}
      </button>
    </div>
  );
}

export default DormCard;