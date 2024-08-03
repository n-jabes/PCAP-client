import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Locations from '../utils/Locations';

const formatDateToYMDHM = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

const PcapDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('IMSI');
  const [Operator, setOperator] = useState('MTN');
  const [filterValue, setFilterValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const getLocationDetails = (locationCode) => {
    for (const site of Locations) {
      for (const sector of site.sectors) {
        if (sector.code === locationCode) {
          return {
            siteName: site.siteName,
            sectorName: sector.name,
          };
        }
      }
    }
    return { siteName: 'Unknown', sectorName: 'Unknown' };
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

        // console.log(transformedData);
        setData(transformedData);
        setFilteredData(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching subscriber data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleOperatorChange = (event) => {
    setOperator(event.target.value);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filterData = (event) => {
    event.preventDefault();

    let filtered = data;

    if (event.target.id === 'timeFilterForm') {
      // Time filter
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filtered = filtered.filter((subscriber) => {
          const subscriberDate = new Date(subscriber.time);
          return subscriberDate >= start && subscriberDate <= end;
        });
      }
    } else if (event.target.id === 'dataFilterForm') {
      // Data filter
      if (filterValue) {
        filtered = filtered.filter((subscriber) =>
          subscriber[filterType]
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      }
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setCurrentPage(1);
    setFilterType('IMSI');
    setFilterValue('');
    setStartDate('');
    setEndDate('');
    fetchData();
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-6 py-2 h-max overflow-y-auto">
      <div className="my-2 flex flex-wrap gap-2">
        <h3 className="w-full font-bold">Choose Operator</h3>
        <form
          id="dataFilterForm"
          className="flex flex-wrap gap-4"
          onSubmit={filterData}
        >
          <select
            value={filterType}
            onChange={handleOperatorChange}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          >
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="KTRN">KTRN</option>
          </select>

          {/* to be used when the user is required to enter an input */}
          {/* <input
            type="text"
            value={filterValue}
            onChange={handleFilterValueChange}
            placeholder={`Filter by ${filterType}`}
            className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          /> */}
          <button
            onClick={fetchData}
            className="w-max bg-gray-500 hover:bg-gray-700 text-sm text-white font-thin py-2 px-6 rounded"
          >
            Fetch All
          </button>
        </form>

        {/* time filters */}
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

        {/* subscriber filters */}
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
          type=""
          className="w-max text-sm px-6 py-2 bg-gray-200 text-white font-medium rounded border-[1px] bg-gray-500 hover:bg-gray-700 hover:text-white"
          onClick={handleClearAllFilters}
        >
          Clear All Filters
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
                NB
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
              <th className="py-3 px-4 border-b whitespace-nowrap font-bold">
                HssRealm
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center py-10">
                  <div className="ml-[45vw] my-[10vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((subscriber, index) => (
                <tr key={index} className="bg-white hover:bg-[#f7fafa]">
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {index + 1 + offset}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.time}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.IMSI}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.MSISDN}
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
                      : 'Unkown'}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.MM}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.NB}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.RANId}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.Location}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {getLocationDetails(subscriber.Location).siteName}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {getLocationDetails(subscriber.Location).sectorName}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    {subscriber.HssRealm}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full bg-gray-100 pt-[2px] px-4 text-sm">
        Total subscribers:
        <span className="text-gray-500 font-bold">{filteredData.length}</span>
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
    </div>
  );
};

export default PcapDataTable;
