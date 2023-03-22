import Head from 'next/head'


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
  const [tweets, setTweets] = useState([]);

  async function searchTweets() {
    const body = {
      keyword: keyword,
      short_language: short_language,
      language: language,
      limit: limit,
    };
    const response = await fetch('https://9okq07ijr6.execute-api.us-east-1.amazonaws.com/dev/analysis', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        // "Access-Control-Allow-Origin": "*",

        // "Access-Control-Allow-Credentials": "true",
        // "Access-Control-Allow-Headers": "true",
        // "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(body),
    })
    // .then(response => response.json())
    .then(data => console.log(data))
    // .catch(error => console.error(error));;

    // console.log(response)

    // setTweets(response);
  }

  function formatData() {
    const data = {
      labels: [],
      datasets: [
        {
          label: 'Tweets',
          data: [],
          fill: false,
          borderColor: '#0070f3',
        },
      ],
    };
    tweets.forEach((tweet) => {
      data.labels.push(moment(tweet.created_at).format('YYYY-MM-DD HH:mm:ss'));
      data.datasets[0].data.push(tweet.id);
    });
    return data;
  }

  function formatTableData() {
    const data = tweets.map((tweet) => ({
      id: tweet.id,
      created_at: moment(tweet.created_at).format('YYYY-MM-DD HH:mm:ss'),
      keyword: tweet.keyword,
      text: tweet.text,
      url: tweet.url,
    }));
    return data;
  }


  return (
    <>
      <Head>
        <title>Twitter Search</title>
      </Head>
      <div>
        <h1>Search Twitter</h1>
        <form onSubmit={(event) => { event.preventDefault(); searchTweets(); }}>
          <label>
            Keyword:
            <input type="text" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </label>
          <label>
            Short Lenguage:
            <input type="text" value={short_language} onChange={(event) => setShortLengague(event.target.value)} />
          </label>
          <label>
            Lenguage:
            <input type="text" value={language} onChange={(event) => setLengague(event.target.value)} />
          </label>
          <label>
            Limit:
            <input type="number" value={limit} onChange={(event) => setLimit(event.target.value)} />
          </label>
          <button type="submit">Search</button>
        </form>
        {/* {tweets.length > 0 && (
          <>
            <h2>Tweets</h2>
            <Line data={formatData()} />
            <ReactTable columns={[
              { Header: 'ID', accessor: 'id' },
              { Header: 'Created At', accessor: 'created_at' },
              { Header: 'Keyword', accessor: 'keyword' },
              { Header: 'Text', accessor: 'text' },
              { Header: 'URL', accessor: 'url' },
            ]} data={formatTableData()} />
          </>
        )} */}
      </div>
    </>
  );
}
