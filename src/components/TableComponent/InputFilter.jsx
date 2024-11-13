import React from 'react';

const InputFilter = ({ filterText, onFilterTextChange }) => {
  return (
    <input
      type="text"
      placeholder="Filtrer par nom ou sport"
      value={filterText}
      onChange={e => onFilterTextChange(e.target.value)}
      className="mt-2 p-2 border rounded w-[400px]"
    />
  );
};

export default InputFilter;
