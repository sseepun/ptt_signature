import React, { useRef, useState } from 'react';

const EditableImage = ({ src, onChange }) => {
  const fileInputRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      onChange(previewURL, file);
    }
  };

  return (
    <div
      className={`editable-image ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: '8px',
        padding: '4px',
        display: 'inline-block',
      }}
    >
      <img src={src} alt="Editable" style={{ maxWidth: '100%', display: 'block' }} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default EditableImage;
