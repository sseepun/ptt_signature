import React, { useState } from 'react';

const EditableText = ({ value, color = '#000000', onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onSave(text, color); 
  };

  return (
    <div className={`editable-text ${isEditing ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}>
      {isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ color }}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ color, cursor: 'pointer' }}>{text}</span>
      )}
    </div>
  );
};

export default EditableText;
