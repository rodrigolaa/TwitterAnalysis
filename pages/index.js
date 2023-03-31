// import { TweetList,Container,Form,SubmitButton, FilterList, ChartContainer} from '../components/styles';
import { FaTwitter, FaPlus, FaSpinner, FaArrowUp, FaArrowDown, FaMinusCircle} from 'react-icons/fa';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import styles from '../styles/home.module.css'
import LineChart from '../components/LineChart';

// import styles from './Dropdown.module.css';

// import ReactWordcloud from "react-wordcloud";
// import WordCloud from 'wordcloud';
// import WordCloud from '../components/WordCloud';


export default function Home() {

  const languageCodes = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'de', label: 'German' },


  // Add more language codes and labels as needed
];

  const [selectedLanguage, setSelectedLanguage] = useState('');


  const [keyword, setKeyword] = useState('');
  const [short_language, setShortLanguage] = useState('');
  const [limit, setLimit] = useState(10);


  const [loading, setLoading] = useState(false);
  
  const [tweets, setTweets] = useState({});
  const [sortTweetsUp, setSortedTweetsUp] = useState({})
  const [sortTweetsDown, setSortedTweetsDown] = useState({})

  // const [base64Img, setbase64Img] = useState(null);
  const [cloudImg, setCloudImg] = useState([]);

  const [alert, setAlert] = useState(null);

  const [filters, setFilters] = useState([
    {state: sortTweetsUp, label: 'high'},
    {state: sortTweetsDown, label: 'low'},
    {state: tweets, label: 'normal'},
  ]);

  const [filterIndex, setFilterIndex] = useState(-1)

  // Define the sorting functions
const sortByPolarityAscending = (a, b) => (a.polarity > b.polarity ? 1 : -1);
const sortByPolarityDescending = (a, b) => (a.polarity < b.polarity ? 1 : -1);
 
const sortByCreatedAtAscending = (a, b) => {
  // a.createdAt ? 
  const [date, time] = a.created_at.split(', ') ;
  const [month, day, year] = date.split('/');
  const [hours, minutes, seconds] = time.split(':');
  const dateObjA = new Date(year, month - 1, day, hours, minutes, seconds);
  // console.log(dateObjA)

  // const dateA = new Date(a.createdAt);
  // console.log(dateA)
    const [date_, time_] = b.created_at.split(', ');
    const [month_, day_, year_] = date_.split('/');
    const [hours_, minutes_, seconds_] = time_.split(':');
    const dateObjB = new Date(year_, month_ - 1, day_, hours_, minutes_, seconds_);
    // console.log(dateObjB)


  const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  const formattedDateA = dateObjA.toLocaleString('en-US', options);
  const formattedDateB = dateObjB.toLocaleString('en-US', options);
  // console.log(formattedDateA)

  const timestampA = new Date(formattedDateA).getTime();
  const timestampB = new Date(formattedDateB).getTime();
  // console.log(timestampA)

  return timestampA - timestampB;
};

// Define a function to get the sorted tweets based on the current filter index
const getSortedTweets = () => {
  switch (filterIndex) {
    case 0:
      return tweets;
    case 1:
      return [...tweets].sort(sortByPolarityAscending);
    case 2:
      // console.log(a.createdAt)
      return [...tweets].sort(sortByCreatedAtAscending);
    default:
      return tweets;
  }
};

const labelsLine = tweets.length > 0 &&  getSortedTweets().map(a => a.created_at);
const dataLine = tweets.length > 0 && getSortedTweets().map(a => a.polarity);

const data = {
  labels: tweets.length > 0 &&  getSortedTweets().map(a => a.created_at),

  datasets: [
    {
      label: 'Polarity',
      data: tweets.length > 0 && getSortedTweets().map(a => a.polarity), 
      fill: true,
      // borderColor: 'rgba(75,192,192,1)',
      borderColor: 'hex(#0D2636 )',

      // lineColor: 'rgba(13,38,54,1)',
      lineColor: 'hex(#0D2636 )',

      tension: 0.1,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

// const LineChart = ({ data, options }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef && chartRef.current) {
//       const myChart = new Chart(chartRef.current, {
//         type: 'line',
//         data: data,
//         options: options,
//       });
//     }
//   }, [chartData, chartOptions])};

  async function searchTweets() {

    // setbase64Img(null)
    setCloudImg([])
    setLoading(true);
    setAlert(null)


    const body = {
      keyword: keyword,
      short_language: short_language,
      limit: limit,
    };

    const url = 'https://9okq07ijr6.execute-api.us-east-1.amazonaws.com/dev/analysis';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
    ).then(response => {
      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
      
    })
    .then(data => {
      setTweets(data.raw_data)

    setCloudImg(data.cloud_img_str)


     setSortedTweetsUp(data.raw_data.sort((a,b) => a.polarity - b.polarity))
     
     setSortedTweetsDown(data.raw_data.sort((a,b) => b.polarity - a.polarity))

     setLoading(false)

    // console.log("Data Fetched!")
    // console.log(data.cloud_img_str)




    })
    .catch(error => {
      setAlert(true)
      setLoading(false)
      console.error('There was a problem with the fetch operation:', error);
    })
    ;
    
  }

  function handleinputChange_Keyword(e){
    setKeyword(e.target.value);
    setAlert(null);
  };

  function handleinputChange_ShortLanguage(e){
    // setShortLanguage(e.target.value);
    setSelectedLanguage(e.target.value);
    setAlert(null);
  };
  
  function handleinputChange_Limit(e){
    setLimit(e.target.value);
    setAlert(null);
  };

  function handleFilter(index){
    setFilterIndex(index);
    // setFilters(filters[index].state)
    // console.log(index)
    console.log(cloudImg)

    
  };

  return (
    <>
      <ul className={styles.Container}>
      <li>
        <title>Twitter Analysis</title>
        <h1  className={styles.title}>
          <span className={styles.logo}><FaTwitter size={25}/></span>
          Twitter Analysis
        </h1> 
        </li>

        <form className={styles.Form} onSubmit={(event) => { event.preventDefault(); searchTweets(); }} error={alert}>
        <li>
        <input  className={`${styles.input} ${alert ? styles.error : ''}`} type="text" placeholder="keyword" value={keyword} onChange={handleinputChange_Keyword} />
        {/* <input  className={`${styles.input} ${alert ? styles.error : ''}`} type="text" placeholder="short language" value={short_language} onChange={handleinputChange_ShortLanguage} /> */}
        <select id="language" value={selectedLanguage} onChange={handleinputChange_ShortLanguage}>
        <option value="">Select Language</option>
        {languageCodes.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
        <input  className={`${styles.input} ${alert ? styles.error : ''}`} type="text" placeholder="limit (0-100)" value={limit} onChange={handleinputChange_Limit} />
        <button 
        //  className={`${styles.submitButton}${loading ? 0 : 1}`}
         className={styles.submitButton}
         disabled= {loading}
         type="submit"
         >
          {loading ? (
            <FaSpinner className={styles.rotate} color="#FFF" size={14}/>
          ) : (
            <FaPlus color="#FFF" size={14}/>
           )} 
        </button>
      </li>
      </form>

      {tweets.length > 0  && (
      <ul className={styles.FilterList} active={filterIndex}>
              {filters.map((filter, index) => (
                <button
                  type='button'
                  key = {filter.label}
                  onClick = {() => handleFilter(index)}
                  className={index === filterIndex? styles.active : ''}
                  disabled={index === filterIndex ? 1 : 0}
                >
                  {filter.label === 'high' ?
                  <FaArrowUp color="#000" size={30} /> :
                  filter.label === 'low' ?
                  <FaArrowDown color="#000" size={30} /> :
                  <FaMinusCircle color="#000" size={30} />}

                </button>
                )
              )}
        </ul> 
        )}
        {/* {tweets.length > 0  && (
        <WordCloud />
        )} */}

      {tweets.length > 0  && (
      <li className={styles.chartContainer} >
        <LineChart data={dataLine} labels={labelsLine}/>
      </li>

        )}
        {tweets.length > 0  && (
        <ul className={styles.twitterList}>
          {getSortedTweets().map(tweet=> ( 

            <li className={styles.id} key={String(tweet.id)}>
              <div>
              <p className={styles.time}>{tweet.created_at}</p>
                <strong>
                  <a className={styles.link} href={tweet.url}>{tweet.text}</a>

                    <span className={styles.polarity}>{tweet.polarity}</span>

                </strong>

              </div>

            </li>
          ))}
        </ul>
        )}
      </ul>
    </>
  );
}
