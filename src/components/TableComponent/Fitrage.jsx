import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import InputFilter from './InputFilter';
import DateFilter from './DateFilter';

function Filtrage({ onFilteredRequests, requests, sportNames, onSportSelect }) {
  const [filterText, setFilterText] = useState('');
  const [filterListSports, setFilterListSports] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Function to filter requests based on selected filters
  const filterRequests = () => {
    const filteredRequests = requests.filter(request => {
      const sportName = sportNames[request.sportId]?.toLowerCase() || '';
      const searchText = filterText.toLowerCase();
      return (
        (request.nameTrainee?.toLowerCase().includes(searchText) || sportName.includes(searchText)) &&
        (filterType === '' || request.documentType === filterType) &&
        (filterStatus === '' || request.documentStatus.toString() === filterStatus) &&
        (filterDate === '' || request.onlyDate === filterDate)
      );
    });
    onFilteredRequests(filteredRequests);
  };

  // useEffect to call filterRequests whenever filter criteria change
  useEffect(() => {
    filterRequests();
  }, [filterText, filterType, filterStatus, filterDate, requests, sportNames]);

  return (
    <div className="flex flex-row gap-24 mt-4 mb-6 p-4 bg-gray-100 rounded-lg shadow-md w-full">
      <InputFilter filterText={filterText} onFilterTextChange={setFilterText} />
      <Dropdown onSportSelect={onSportSelect} onFilterListSports={setFilterListSports} />
      <DateFilter filterDate={filterDate} onFilterDateChange={setFilterDate} />
    </div>
  );
}

export default Filtrage;
