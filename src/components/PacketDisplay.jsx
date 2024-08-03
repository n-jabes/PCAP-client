// 
// 
// 
// THIS IS THE BACKUP FOR THE CODES I USED WHEN WORKING WITH .PCAP FILES
// 
// 
// 
// 
// 
// 















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import Pagination from '@mui/material/Pagination';

const numericCountryCodeMap = {
  1: 'United States / Canada',
  7: 'Russia',
  20: 'Egypt',
  27: 'South Africa',
  30: 'Greece',
  31: 'Netherlands',
  32: 'Belgium',
  33: 'France',
  34: 'Spain',
  36: 'Hungary',
  39: 'Italy',
  40: 'Romania',
  41: 'Switzerland',
  43: 'Austria',
  44: 'United Kingdom',
  45: 'Denmark',
  46: 'Sweden',
  47: 'Norway',
  48: 'Poland',
  49: 'Germany',
  51: 'Peru',
  52: 'Mexico',
  53: 'Cuba',
  54: 'Argentina',
  55: 'Brazil',
  56: 'Chile',
  57: 'Colombia',
  58: 'Venezuela',
  60: 'Malaysia',
  61: 'Australia',
  62: 'Indonesia',
  63: 'Philippines',
  64: 'New Zealand',
  65: 'Singapore',
  66: 'Thailand',
  81: 'Japan',
  82: 'South Korea',
  84: 'Vietnam',
  86: 'China',
  90: 'Turkey',
  91: 'India',
  92: 'Pakistan',
  93: 'Afghanistan',
  94: 'Sri Lanka',
  95: 'Myanmar',
  98: 'Iran',
  212: 'Morocco',
  213: 'Algeria',
  216: 'Tunisia',
  218: 'Libya',
  220: 'Gambia',
  221: 'Senegal',
  222: 'Mauritania',
  223: 'Mali',
  224: 'Guinea',
  225: 'Ivory Coast',
  226: 'Burkina Faso',
  227: 'Niger',
  228: 'Togo',
  229: 'Benin',
  230: 'Mauritius',
  231: 'Liberia',
  232: 'Sierra Leone',
  233: 'Ghana',
  234: 'Nigeria',
  235: 'Chad',
  236: 'Central African Republic',
  237: 'Cameroon',
  238: 'Cape Verde',
  239: 'Sao Tome and Principe',
  240: 'Equatorial Guinea',
  241: 'Gabon',
  242: 'Congo',
  243: 'Democratic Republic of the Congo',
  244: 'Angola',
  245: 'Guinea-Bissau',
  246: 'Diego Garcia',
  247: 'Ascension',
  248: 'Seychelles',
  249: 'Sudan',
  250: 'Rwanda',
  251: 'Ethiopia',
  252: 'Somalia',
  253: 'Djibouti',
  254: 'Kenya',
  255: 'Tanzania',
  256: 'Uganda',
  257: 'Burundi',
  258: 'Mozambique',
  260: 'Zambia',
  261: 'Madagascar',
  262: 'Reunion',
  263: 'Zimbabwe',
  264: 'Namibia',
  265: 'Malawi',
  266: 'Lesotho',
  267: 'Botswana',
  268: 'Eswatini',
  269: 'Comoros',
  290: 'Saint Helena',
  291: 'Eritrea',
  297: 'Aruba',
  298: 'Faroe Islands',
  299: 'Greenland',
  350: 'Gibraltar',
  351: 'Portugal',
  352: 'Luxembourg',
  353: 'Ireland',
  354: 'Iceland',
  355: 'Albania',
  356: 'Malta',
  357: 'Cyprus',
  358: 'Finland',
  359: 'Bulgaria',
  370: 'Lithuania',
  371: 'Latvia',
  372: 'Estonia',
  373: 'Moldova',
  374: 'Armenia',
  375: 'Belarus',
  376: 'Andorra',
  377: 'Monaco',
  378: 'San Marino',
  380: 'Ukraine',
  381: 'Serbia',
  382: 'Montenegro',
  383: 'Kosovo',
  385: 'Croatia',
  386: 'Slovenia',
  387: 'Bosnia and Herzegovina',
  389: 'North Macedonia',
  420: 'Czech Republic',
  421: 'Slovakia',
  423: 'Liechtenstein',
  500: 'Falkland Islands',
  501: 'Belize',
  502: 'Guatemala',
  503: 'El Salvador',
  504: 'Honduras',
  505: 'Nicaragua',
  506: 'Costa Rica',
  507: 'Panama',
  508: 'Saint Pierre and Miquelon',
  509: 'Haiti',
  590: 'Guadeloupe',
  591: 'Bolivia',
  592: 'Guyana',
  593: 'Ecuador',
  594: 'French Guiana',
  595: 'Paraguay',
  596: 'Martinique',
  597: 'Suriname',
  598: 'Uruguay',
  599: 'Caribbean Netherlands',
  670: 'East Timor',
  672: 'Norfolk Island',
  673: 'Brunei',
  674: 'Nauru',
  675: 'Papua New Guinea',
  676: 'Tonga',
  677: 'Solomon Islands',
  678: 'Vanuatu',
  679: 'Fiji',
  680: 'Palau',
  681: 'Wallis and Futuna',
  682: 'Cook Islands',
  683: 'Niue',
  685: 'Samoa',
  686: 'Kiribati',
  687: 'New Caledonia',
  688: 'Tuvalu',
  689: 'French Polynesia',
  690: 'Tokelau',
  691: 'Micronesia',
  692: 'Marshall Islands',
  850: 'North Korea',
  852: 'Hong Kong',
  853: 'Macau',
  855: 'Cambodia',
  856: 'Laos',
  880: 'Bangladesh',
  886: 'Taiwan',
  960: 'Maldives',
  961: 'Lebanon',
  962: 'Jordan',
  963: 'Syria',
  964: 'Iraq',
  965: 'Kuwait',
  966: 'Saudi Arabia',
  967: 'Yemen',
  968: 'Oman',
  970: 'Palestine',
  971: 'United Arab Emirates',
  972: 'Israel',
  973: 'Bahrain',
  974: 'Qatar',
  975: 'Bhutan',
  976: 'Mongolia',
  977: 'Nepal',
  992: 'Tajikistan',
  993: 'Turkmenistan',
  994: 'Azerbaijan',
  995: 'Georgia',
  996: 'Kyrgyzstan',
  998: 'Uzbekistan',
};

countries.registerLocale(en);

const formatDateToYMDHM = (dateString) => {
  const regex = /^(\w+ \d+, \d+ \d{2}:\d{2}:\d{2}\.\d{6})/;
  const match = dateString.match(regex);

  if (!match) {
    return 'Invalid Date';
  }

  const parsedDateString = match[0];
  const date = new Date(parsedDateString);
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day}-${hours}:${minutes}`;
};

const getCountryName = (code) => {
  if (!code || code === 'N/A') return '';

  const numericCode = code.replace(/\D/g, '');
  return numericCountryCodeMap[numericCode] || '';
};

const PcapDataTable = () => {
  const [data, setData] = useState([]);
  const [showEmptyRows, setShowEmptyRows] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get('http://localhost:3000/api/pcap-data/')
      .then((response) => {
        const transformedData = response.data.map((packet) => ({
          ...packet,
          time: formatDateToYMDHM(packet.time),
          locationCountryCode: getCountryName(packet.locationCountryCode),
        }));

        console.log(transformedData);
        console.log(response.data);
        setData(transformedData);
        setFilteredData(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching pcap data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isValidValue = (value) => {
    return value && value !== 'N/A';
  };

  const toggleShowEmptyRows = () => {
    setShowEmptyRows(!showEmptyRows);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filterDataByDate = (event) => {
    event.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = data.filter((packet) => {
      const packetDate = new Date(packet.time);
      return packetDate >= start && packetDate <= end;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const finalData = showEmptyRows
    ? filteredData
    : filteredData.filter(
        (packet) =>
          isValidValue(packet.callingPartyNumber) ||
          isValidValue(packet.calledPartyNumber)
      );

  const pageCount = Math.ceil(finalData.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentData = finalData.slice(offset, offset + itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-6 py-2 h-[100vh] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-3">Location update</h1>
      <div className="md:w-[44%] my-2 flex flex-col md:flex-row md:items-center md:justify-between md:gap-8 gap-2">
        <button
          onClick={fetchData}
          className="w-max bg-gray-500 hover:bg-gray-700 text-sm text-white font-thin py-2 px-6 rounded"
        >
          Fetch MSISDN
        </button>
        <button
          onClick={toggleShowEmptyRows}
          className="w-max bg-gray-500 hover:bg-gray-700 text-sm text-white font-thin py-2 px-6 rounded"
        >
          {showEmptyRows ? 'Hide Empty Rows' : 'Show Empty Rows'}
        </button>
      </div>

      <form className="my-2 flex flex-wrap gap-4" onSubmit={filterDataByDate}>
        <input
          type="datetime-local"
          value={startDate}
          onChange={handleStartDateChange}
          className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          required
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={handleEndDateChange}
          className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
          required
        />
        <button
          type="submit"
          className="w-max text-sm px-6 py-2 bg-gray-200 text-white font-medium rounded border-[1px] bg-gray-500 hover:bg-gray-700 hover:text-white"
        >
          Filter
        </button>
      </form>

      <div className="mt-2 overflow-x-auto border-[1px] border-gray-200 h-max min-h-[60vh]">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0  bg-white border-b-[1px] border-b-gray-200">
            <tr className="text-gray-500 text-xs text-left ">
              <th className="py-3 px-4 border-b">#</th>
              <th className="py-3 px-4 border-b font-bold">Time</th>
              <th className="py-3 px-4 border-b font-bold">
                Calling Party Number
              </th>
              <th className="py-3 px-4 border-b font-bold">
                Called Party Number
              </th>
              <th className="py-3 px-4 border-b font-bold">Country Code</th>
              <th className="py-3 px-4 border-b font-bold">MSISDN</th>
              <th className="py-3 px-4 border-b font-bold">Location Number</th>
              <th className="py-3 px-4 border-b font-bold">
                Location Country Code
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  <div className="ml-[45vw] my-[10vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((packet, index) => (
                <tr key={index} className="bg-white hover:bg-[#f7fafa]">
                  <td className="py-2 px-4 border-b text-gray-600">
                    {index + 1 + offset}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.time}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.callingPartyNumber}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.calledPartyNumber}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.countryCode}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.msisdn}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.locationNumber}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {packet.locationCountryCode}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full bg-gray-100 pt-[2px] px-4 text-sm">
        Total packets:
        <span className="text-gray-500 font-bold">{finalData.length}</span>
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