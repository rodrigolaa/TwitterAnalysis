import { TweetList,Container,Form,SubmitButton, FilterList, ChartContainer} from '../components/styles';
import { FaTwitter, FaPlus, FaSpinner, FaArrowUp, FaArrowDown, FaMinusCircle} from 'react-icons/fa';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
// import ReactWordcloud from "react-wordcloud";
// import WordCloud from 'wordcloud';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [short_language, setShortLanguage] = useState('');
  const [limit, setLimit] = useState(10);


  const [loading, setLoading] = useState(false);
  
  const [tweets, setTweets] = useState({});
  const [sortTweetsUp, setSortedTweetsUp] = useState({})
  const [sortTweetsDown, setSortedTweetsDown] = useState({})

  // const [base64Img, setbase64Img] = useState(null);
  const [cloudImg, setCloudImg] = useState(null);

  const [alert, setAlert] = useState(null);

  const [filters, setFilters] = useState([
    {state: sortTweetsUp, label: 'high'},
    {state: sortTweetsDown, label: 'low'},
    {state: tweets, label: 'normal'},
  ]);

  const [filterIndex, setFilterIndex] = useState(0)


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

const data = {
  labels: tweets.length > 0 &&  getSortedTweets().map(a => a.created_at),
  datasets: [
    {
      label: 'Polarity',
      data: tweets.length > 0 && getSortedTweets().map(a => a.polarity), 
      fill: true,
      borderColor: 'rgba(75,192,192,1)',
      lineColor: 'rgba(13,38,54,1)',
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

const LineChart = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: 'line',
        data: data,
        options: options,
      });
    }
  }, [chartData, chartOptions])};

  async function searchTweets() {

    // setbase64Img(null)
    setCloudImg(null)
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

      // setbase64Img(data.body.sentiment_analysis_img_str)

      setCloudImg(data.cloud_img_str)

     setSortedTweetsUp(data.raw_data.sort((a,b) => a.polarity - b.polarity))
     
     setSortedTweetsDown(data.raw_data.sort((a,b) => b.polarity - a.polarity))

     setLoading(false)


    })
    .catch(error => {
      setAlert(true)
      setLoading(false)
      console.error('There was a problem with the fetch operation:', error);
    })
      // console.log(tweets)
    ;
    
  }

  function handleinputChange_Keyword(e){
    setKeyword(e.target.value);
    setAlert(null);
  };

  function handleinputChange_ShortLanguage(e){
    setShortLanguage(e.target.value);
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
    
  };

  return (
    <>
      <Container>
        <title>Twitter Analysis</title>
        <ul>
        <h1>
          <FaTwitter size={25}/>
          Twitter Analysis
        </h1> 
        <Form onSubmit={(event) => { event.preventDefault(); searchTweets(); }} error={alert}>
        <input type="text" placeholder="keyword" value={keyword} onChange={handleinputChange_Keyword} />
        <input type="text" placeholder="short language" value={short_language} onChange={handleinputChange_ShortLanguage} />
        <input type="text" placeholder="limit (0-100)" value={limit} onChange={handleinputChange_Limit} />
        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14}/>
          ) : (
            <FaPlus color="#FFF" size={14}/>
          )}
        </SubmitButton>
      </Form>

      <FilterList active={filterIndex}>
              {filters.map((filter, index) => (
                <button
                  // type='button'
                  key = {filter.label}
                  onClick = {() => handleFilter(index)}
                >
                  {filter.label === 'high' ?
                  <FaArrowUp color="#000" size={30} /> :
                  filter.label === 'low' ?
                  <FaArrowDown color="#000" size={30} /> :
                  <FaMinusCircle color="#000" size={30} />}

                </button>
              ))}
            </FilterList>

      {tweets.length > 0  &&
      <ChartContainer>
      <Line data={data} options={options} />
      </ChartContainer>}

        {/* {base64Img && <img height='250' src={`data:image/png;base64,${base64Img}`} alt="Bar Chart" /> } */}

        {/* {cloudImg && <img height='250' src={`data:image/png;base64,${cloudImg}`} alt="Cloud Img" /> } */}

        {/* <ReactWordcloud words={words} /> */}
        {/* {render(<WordCloud data={data} />, document.getElementById('root'))} */}

        {/* <WordCloud data={cloudImg} /> */}
        
            
        </ul>
        </Container>

        <TweetList>
        {tweets.length > 0 && (
          <>
          {getSortedTweets().map(tweet=> ( 

            <li key={String(tweet.id)}>
              <div>
              <p>{tweet.created_at}</p>
                <strong>
                  <a href={tweet.url}>{tweet.text}</a>

                    <span >{tweet.polarity}</span>

                </strong>

              </div>

            </li>
          ))}
          </>
        )}
        </TweetList>
    </>
  );
          }
