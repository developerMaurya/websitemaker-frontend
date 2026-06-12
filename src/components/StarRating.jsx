import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, interactive = false, onRatingChange = null, size = 18 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {stars.map((star) => {
        const filled = star <= rating;
        return (
          <Star
            key={star}
            size={size}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fill: filled ? '#fbbf24' : 'transparent',
              color: filled ? '#fbbf24' : '#4b5563',
              transition: 'transform 0.1s ease',
            }}
            className={interactive ? 'hover:scale-125' : ''}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
