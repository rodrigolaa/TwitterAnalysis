import Head from 'next/head'

import { TweetList,Container,Form,SubmitButton, FilterList} from '../components/styles';
import { FaTwitter, FaPlus, FaSpinner, FaArrowUp, FaArrowDown, FaMinusCircle} from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { setConfig } from 'next/config';


export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [short_language, setShortLanguage] = useState('');

  const [loading, setLoading] = useState(false);
  const [language, setLengague] = useState('');
  const [limit, setLimit] = useState(10);
  
  const [tweets, setTweets] = useState({});
  const [sortTweetsUp, setSortedTweetsUp] = useState({})
  const [sortTweetsDown, setSortedTweetsDown] = useState({})

  const [base64Img, setbase64Img] = useState(null);
  const [cloudImg, setCloudImg] = useState(null);

  const [alert, setAlert] = useState(null);

  const [filters, setFilters] = useState([
    {state: sortTweetsUp, label: 'high'},
    {state: sortTweetsDown, label: 'low'},
    {state: tweets, label: 'normal'},
  ]);

  const [filterIndex, setFilterIndex] = useState(0)

  const [filterList, setFilterList] = useState([])

  // Define the sorting functions
const sortByPolarityAscending = (a, b) => (a.polarity > b.polarity ? 1 : -1);
const sortByPolarityDescending = (a, b) => (a.polarity < b.polarity ? 1 : -1);
const sortByCreatedAtAscending = (a, b) => (a.created_at > b.created_at ? 1 : -1);
const sortByCreatedAtDescending = (a, b) => (a.created_at < b.created_at ? 1 : -1);

// Define a function to get the sorted tweets based on the current filter index
const getSortedTweets = () => {
  switch (filterIndex) {
    case 0:
      return tweets;
    case 1:
      return [...tweets].sort(sortByPolarityAscending);
    case 2:
      return [...tweets].sort(sortByCreatedAtDescending);
    default:
      return tweets;
  }
};

  // useEffect(() => {
  //   async function loadingTweets(){
  //     setFilterList(filters[filterIndex].state)
  //   }
  //   loadingTweets()
  // })[filters,filterIndex]

  async function searchTweets() {

    setbase64Img(null)
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
      setTweets(data.body.raw_data)

      setbase64Img(data.body.sentiment_analysis_img_str)

      setCloudImg(data.body.cloud_img_str)

      setLoading(false)

     setSortedTweetsUp(data.body.raw_data.sort((a,b) => a.polarity - b.polarity))
     
     setSortedTweetsDown(data.body.raw_data.sort((a,b) => b.polarity - a.polarity))

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
    console.log(filters[filterIndex].state)
    
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

        {base64Img && <img height='250' src={`data:image/png;base64,${base64Img}`} alt="Bar Chart" /> }

        {cloudImg && <img height='250' src={`data:image/png;base64,${cloudImg}`} alt="Cloud Img" /> }
            
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
