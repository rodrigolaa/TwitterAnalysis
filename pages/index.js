import Head from 'next/head'

import { TweetList,Container,Form,SubmitButton} from '../components/styles';
import { FaTwitter, FaPlus, FaSpinner} from 'react-icons/fa';
import { useState } from 'react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [short_language, setShortLanguage] = useState('');

  const [loading, setLoading] = useState(false);
  const [language, setLengague] = useState('');
  const [limit, setLimit] = useState(10);
  const [tweets, setTweets] = useState({});
  const [base64Img, setbase64Img] = useState(null);
  const [cloudImg, setCloudImg] = useState(null);

  const [alert, setAlert] = useState(null);



  async function searchTweets() {

    setbase64Img(null)
    setLoading(true);
    setAlert(null)

    const body = {
      keyword: keyword,
      short_language: short_language,
      // language: language,
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
