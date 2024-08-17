import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Locations from '../utils/2G_core_areas.js';
import GoogleMapsEmbed from './GoogleMapsEmbed.jsx';

const formatDateToYMDHM = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(
    2,
    '0'
  )}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const PcapDataTable = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('IMSI');
  const [operator, setOperator] = useState('MTN');
  const [filterValue, setFilterValue] = useState('');
  const [kmlId, setKmlId] = useState(null);
  const [showPopup, setShowPopup] = useState();
  const [coordinates, setCoordinates] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const getLocationDetails = (locationCode) => {
    const parts = locationCode.split('-');
    const ci = parts[parts.length - 1];
    const location = Locations.find((loc) => loc['CI(*)'] === parseInt(ci));

    if (location) {
      return location;
    } else {
      return {
        'Core Location': 'Unknown',
        MCC: 'Unknown',
        MNC: 'Unknown',
        'LAC(*)': 'Unknown',
        RAC: 'Unknown',
        'CI(*)': 'Unknown',
        'Site Name': 'Unknown',
        'Sector Location': 'Unknown',
        Longitude: '0',
        Latitude: '0',
        'Azimuth(*)': 'Unknown',
      };
    }
  };

  const fetchData = () => {
    setLoading(true);
    axios
      .get('https://pcap-backend.onrender.com/api/subscriber-data')
      .then((response) => {
        const transformedData = response.data.map((subscriber) => ({
          ...subscriber,
          time: formatDateToYMDHM(subscriber.time),
        }));
        setData(transformedData);
        setCurrentData(transformedData);
      })
      .catch((error) => console.error('Error fetching subscriber data:', error))
      .finally(() => setLoading(false));
  };

  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);
  const handleFilterTypeChange = (event) => setFilterType(event.target.value);
  const handleOperatorChange = (event) => setOperator(event.target.value);
  const handleFilterValueChange = (event) => setFilterValue(event.target.value);

  const applyFilter = (filterFunction) => {
    setCurrentData((prevData) => prevData.filter(filterFunction));
    setCurrentPage(1);
  };

  const filterData = (event) => {
    event.preventDefault();
    if (event.target.id === 'timeFilterForm' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      applyFilter((subscriber) => {
        const subscriberDate = new Date(subscriber.time);
        return subscriberDate >= start && subscriberDate <= end;
      });
    } else if (event.target.id === 'dataFilterForm' && filterValue) {
      applyFilter((subscriber) =>
        subscriber[filterType].toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  };

  const handleClearAllFilters = () => {
    setCurrentPage(1);
    setFilterType('IMSI');
    setFilterValue('');
    setStartDate('');
    setEndDate('');
    setCurrentData(data);
  };

  const handlePageChange = (event, page) => setCurrentPage(page);

  const handleLocationsFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://pcap-backend.onrender.com/api/upload-locations',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setKmlId(response.data.kmlId);
      alert('Locations file uploaded and processed successfully');
    } catch (error) {
      console.error('Error uploading locations file:', error);
      alert('Error uploading locations file', error);
    }
  };

  const downloadKML = async () => {
    if (!kmlId) {
      alert('No KML file available. Please upload a locations file first.');
      return;
    }

    try {
      const response = await axios.get(
        `https://pcap-backend.onrender.com/api/kml/${kmlId}`,
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '2G_core_areas.kml');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading KML:', error);
      alert('Error downloading KML file');
    }
  };

  const handleRowClick = (subscriber) => {
    const selectedMSISDN = subscriber.MSISDN;
    const matchingSubscribers = currentData.filter(
      (item) => item.MSISDN === selectedMSISDN
    );
    const locations = matchingSubscribers.map((item) => item.Location);

    // console.log('locations', locations);

    const coordinates = locations
      .map((locationCode) => getLocationDetails(locationCode))
      .map((location) => ({
        lat: parseFloat(location.Latitude),
        lng: parseFloat(location.Longitude),
      }));

    console.log('coordinates', coordinates);

    setCoordinates(coordinates);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const pageCount = Math.ceil(currentData.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(offset, offset + itemsPerPage);

  return (
    <div className="px-6 py-2 h-max overflow-y-auto relative">
      <div className="my-2 flex flex-wrap gap-2">
        <h3 className="w-full font-bold">Choose Operator</h3>
        <form
          id="dataFilterForm"
          className="flex flex-wrap gap-4"
          onSubmit={filterData}
        >
          <select
            value={operator}
            onChange={handleOperatorChange}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          >
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="KTRN">KTRN</option>
          </select>
          <button
            onClick={fetchData}
            className="w-max bg-gray-500 hover:bg-gray-700 text-sm text-white font-thin py-2 px-6 rounded"
          >
            Fetch All
          </button>
        </form>

        <h3 className="w-full font-bold">Time Filters</h3>
        <form
          id="timeFilterForm"
          className="flex flex-wrap gap-4"
          onSubmit={filterData}
        >
          <input
            type="datetime-local"
            value={startDate}
            onChange={handleStartDateChange}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={handleEndDateChange}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          />
          <button
            type="submit"
            className="w-max text-sm px-6 py-2 bg-gray-200 text-white font-medium rounded border-[1px] bg-gray-500 hover:bg-gray-700 hover:text-white"
          >
            Apply Time Filter
          </button>
        </form>

        <h3 className="w-full font-bold">Subscriber Filters</h3>
        <form
          id="dataFilterForm"
          className="flex flex-wrap gap-4"
          onSubmit={filterData}
        >
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          >
            <option value="IMSI">IMSI</option>
            <option value="MSISDN">MSISDN</option>
            <option value="IMEI">IMEI</option>
          </select>
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterValueChange}
            placeholder={`Filter by ${filterType}`}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          />
          <button
            type="submit"
            className="w-max text-sm px-6 py-2 bg-gray-200 text-white font-medium rounded border-[1px] bg-gray-500 hover:bg-gray-700 hover:text-white"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          className="w-max text-sm px-6 py-2 bg-gray-200 text-white font-medium rounded border-[1px] bg-gray-500 hover:bg-gray-700 hover:text-white"
          onClick={handleClearAllFilters}
        >
          Clear All Filters
        </button>

        <h3 className="w-full font-bold">Upload Locations File</h3>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleLocationsFileUpload}
          className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
        />
        <button
          onClick={downloadKML}
          className="w-max bg-gray-500 hover:bg-gray-700 text-sm text-white font-thin py-2 px-6 rounded"
        >
          Download KML
        </button>
      </div>

      <div className="mt-2 overflow-x-auto border-[1px] border-gray-200 h-[60vh]">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-white border-b-[1px] border-b-gray-200">
            <tr className="text-gray-500 text-xs text-left">
              <th className="py-3 px-4 border-b whitespace-nowrap">#</th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                Time
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                IMSI
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                MSISDN
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                IMEI
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                R (Radio Access Type)
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                MM (Mobility management state)
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                RAN-Id
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                Location
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                Site Name
              </th>
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                Sector Location
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-10">
                  <div className="ml-[45vw] my-[10vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((subscriber, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-[#f7fafa] cursor-pointer"
                >
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {index + 1 + offset}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.time}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.IMSI}
                  </td>
                  <td
                    className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                    onClick={() => handleRowClick(subscriber)}
                  >
                    **********
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.IMEI}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.R === 'L'
                      ? '4G'
                      : subscriber.R === 'G'
                      ? '2G'
                      : subscriber.R === 'W'
                      ? '3G'
                      : 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.MM}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.RANId}
                  </td>
                  <td
                    className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                    onClick={() => handleRowClick(subscriber)}
                  >
                    {subscriber.Location}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {getLocationDetails(subscriber.Location)['Site Name']}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {getLocationDetails(subscriber.Location)['Sector Location']}
                  </td>
                  {/* <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.HssRealm}
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full bg-gray-100 pt-[2px] px-4 text-sm">
        Total subscribers:
        <span className="text-gray-500 font-bold">{currentData.length}</span>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          size="small"
          color="primary"
        />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg w-3/4 h-3/4 relative overflow-y-auto">
            <button
              onClick={closePopup}
              className="absolute top-2 z-10 right-2 font-bold bg-gray-200 text-red-600 hover:bg-red-400 hover:text-white w-max px-2 border-[1px] border-red-400 rounded"
            >
              x
            </button>
            <div className="w-full h-full">
              <GoogleMapsEmbed coordinates={coordinates} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PcapDataTable;
