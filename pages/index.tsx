// import { TweetList,Container,Form,SubmitButton, FilterList, ChartContainer} from '../components/styles';
import { FaTwitter, FaPlus, FaSpinner, FaArrowUp, FaArrowDown, FaMinusCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import styles from '../styles/home.module.css'
import LineChart from '../components/LineChart';
import { GetServerSideProps } from 'next';
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc, DocumentData, Query, getDocs, updateDoc } from 'firebase/firestore'
import SimpleCloud from '../components/wordcloud/WordCloud';
import db from '../services/firebaseConnection';
import { getSession } from 'next-auth/react';
import React from 'react';

interface HomeProps {
  user: {
    id: string;
    name: string;
  }
}


export default function Home({ user }: HomeProps) {

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

  const [tweets, setTweets] = useState([]);
  const [sortTweetsUp, setSortedTweetsUp] = useState({})
  const [sortTweetsDown, setSortedTweetsDown] = useState({})

  // const [base64Img, setbase64Img] = useState(null);
  const [cloudImg, setCloudImg] = useState([]);

  const [alert, setAlert] = useState(null);

  const [filters, setFilters] = useState([
    { state: sortTweetsUp, label: 'high' },
    { state: sortTweetsDown, label: 'low' },
    { state: tweets, label: 'normal' },
  ]);

  const [filterIndex, setFilterIndex] = useState(-1)

  // Define the sorting functions
  const sortByPolarityAscending = (a, b) => (a.polarity > b.polarity ? 1 : -1);
  const sortByPolarityDescending = (a, b) => (a.polarity < b.polarity ? 1 : -1);

  const sortByCreatedAtAscending = (a, b) => {
    // a.createdAt ? 
    const [date, time] = a.created_at.split(', ');
    const [month, day, year] = date.split('/');
    const [hours, minutes, seconds] = time.split(':');
    const dateObjA = new Date(year, month - 1, day, hours, minutes, seconds);

    const [date_, time_] = b.created_at.split(', ');
    const [month_, day_, year_] = date_.split('/');
    const [hours_, minutes_, seconds_] = time_.split(':');
    const dateObjB = new Date(year_, month_ - 1, day_, hours_, minutes_, seconds_);


    const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    const formattedDateA = dateObjA.toLocaleString('en-US', options);
    const formattedDateB = dateObjB.toLocaleString('en-US', options);

    const timestampA = new Date(formattedDateA).getTime();
    const timestampB = new Date(formattedDateB).getTime();

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
        return [...tweets].sort(sortByCreatedAtAscending);
      default:
        return tweets;
    }
  };

  const labelsLine = tweets.length > 0 && getSortedTweets().map(a => a.created_at);
  const dataLine = tweets.length > 0 && getSortedTweets().map(a => a.polarity);


  async function searchTweets() {

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


        setSortedTweetsUp(data.raw_data.sort((a, b) => a.polarity - b.polarity))

        setSortedTweetsDown(data.raw_data.sort((a, b) => b.polarity - a.polarity))

        setLoading(false)



      })
      .catch(error => {
        setAlert(true)
        setLoading(false)
        console.error('There was a problem with the fetch operation:', error);
      })
      ;

  }

  function handleinputChange_Keyword(e) {
    setKeyword(e.target.value);
    setAlert(null);
  };

  function handleinputChange_ShortLanguage(e) {
    // setShortLanguage(e.target.value);
    setSelectedLanguage(e.target.value);
    setAlert(null);
  };

  function handleinputChange_Limit(e) {
    setLimit(e.target.value);
    setAlert(null);
  };

  function handleFilter(index) {
    setFilterIndex(index);
    // setFilters(filters[index].state)


  };

  async function handleKeywordSave(event) {
    event.preventDefault();

    console.log(tweets[0].keyword)

    const queryTweets = query(collection(db, 'keyword'), where('keyword', '==', tweets[0].keyword), where('userId', '==', user.id))

    const snapshotComments = await getDocs(queryTweets)
    // console.log(snapshotComments)

    if (!snapshotComments.empty) {

      const documentIds = [];

      snapshotComments.forEach(async (documentSnapshot) => {
        const documentId = documentSnapshot.id;
        documentIds.push(documentId);
        const currentTweets = documentSnapshot.data().tweets || [];
        // console.log(currentTweets)
        const currentCloudImg = documentSnapshot.data().cloudImg || [];
        console.log(currentCloudImg[0])
        // console.log(documentIds[0])
        try {
          await updateDoc(doc(db, "keyword", documentIds[0]), {

            cloudImg: currentCloudImg.concat(cloudImg),
            tweets: currentTweets.concat(tweets),

          });
        } catch (err) {
          console.log(err)
        }


      })
    }


    try {
      await addDoc(collection(db, "keyword"), {
        keyword: tweets[0].keyword,
        created: new Date(),
        userId: user.id,
        name: user.name,
        cloudImg: cloudImg,
        tweets: tweets,

      });

      setKeyword('');
      setLimit(0);
      setSelectedLanguage('');

    }
    catch (err) {
      console.log(err)
    }

  }

  return (
    <ul className={styles.Container}>
      <li>
        <title>Twitter Analysis</title>
      </li>

      <form className={styles.Form} onSubmit={(event) => { event.preventDefault(); searchTweets(); }} onError={alert}>
        <li>
          <input className={`${styles.input} ${alert ? styles.error : ''}`} type="text" placeholder="keyword" value={keyword} onChange={handleinputChange_Keyword} />
          {/* <input  className={`${styles.input} ${alert ? styles.error : ''}`} type="text" placeholder="short language" value={short_language} onChange={handleinputChange_ShortLanguage} /> */}
          <select id="language" value={selectedLanguage} onChange={handleinputChange_ShortLanguage}>
            <option value="">Select Language</option>
            {languageCodes.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <input className={`${styles.input} ${alert ? styles.error : ''}`} type="text" placeholder="limit (0-100)" value={limit} onChange={handleinputChange_Limit} />
          <button
            //  className={`${styles.submitButton}${loading ? 0 : 1}`}
            className={styles.submitButton}
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <FaSpinner className={styles.rotate} color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </button>
          {tweets.length > 0 && user?.id !== '' && (
            <button className={styles.saveButton} onClick={handleKeywordSave}>
              Save
            </button>
          )}
        </li>
      </form>

      {tweets.length > 0 && (
        // <ul className={styles.FilterList} active={filterIndex}>
        <ul className={styles.FilterList}>
          {filters.map((filter, index) => (
            <button
              type='button'
              key={filter.label}
              onClick={() => handleFilter(index)}
              className={index === filterIndex ? styles.active : ''}
              disabled={index === filterIndex ? true : false}
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
      {tweets.length > 0 && (
        <ul className={styles.chartAnalysis}>

          <li className={styles.chartContainer} >

            <LineChart data={dataLine} labels={labelsLine} />
          </li>

          <li className={styles.chartCloud}>
            <SimpleCloud data={cloudImg} />

          </li>

        </ul>

      )}

      {tweets.length > 0 && (
        <ul className={styles.twitterList}>
          {getSortedTweets().map(tweet => (

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
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const session = await getSession({ req })

  // console.log(session)
  if (!session?.user) {
    return {
      props: {
        user: {
          name: '',
          id: '',
        },
      },
    };
  }
  return {
    props: {
      user: {
        name: session?.user.name,
        id: session?.user.email,
      }
    },
  };
};