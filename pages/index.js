import Head from 'next/head'

import { TweetList,Container} from './styles';


// const inter = Inter({ subsets: ['latin'] })

import { useState } from 'react';
import moment from 'moment';
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import ReactTable from 'react-table';
// import 'react-table/react-table.css';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [short_language, setShortLengague] = useState('');
  const [language, setLengague] = useState('');
  const [limit, setLimit] = useState(10);
  const [tweets, setTweets] = useState({});
  const [base64Img, setbase64Img] = useState(null);



  async function searchTweets() {

    setbase64Img(null)

    const body = {
      keyword: keyword,
      short_language: short_language,
      language: language,
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
      // console.log(data.body); // Logs the response body as a JavaScript object
      // return data;
      setTweets(data.body.raw_data)

      // const base64_response = data.body.sentiment_analysis_img_str

      setbase64Img(data.body.sentiment_analysis_img_str)

      // return base64_response

    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    })
    console.log(tweets)
    ;
    
    
  }

  return (
    <>
      <Container>
        <title>Twitter Analysis</title>
  
        <ul>
        <h1>Search Twitter</h1>

        <form onSubmit={(event) => { event.preventDefault(); searchTweets(); }}>
          <li>
            Keyword:
            <input type="text" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </li>
          <li>
            Short Lenguage:
            <input type="text" value={short_language} onChange={(event) => setShortLengague(event.target.value)} />
          </li>
          <li>
            Lenguage:
            <input type="text" value={language} onChange={(event) => setLengague(event.target.value)} />
          </li>
          <li>
            Limit:
            <input type="number" value={limit} onChange={(event) => setLimit(event.target.value)} />
          </li>
          <button type="submit">Search</button>
        </form>
        {base64Img && <img height='250' src={`data:image/png;base64,${base64Img}`} alt="My image" /> }

        </ul>

        </Container>
        
        <TweetList>
    
        {tweets.length > 0 && (
          
          <>
          {tweets.map(tweet => (
            <li key={String(tweet.id)}>
              {/* <img src={issue.user.avatar_url} alt={issue.user.login} /> */}
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
