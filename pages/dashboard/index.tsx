
import { GetServerSideProps } from 'next';
import {  useState, useEffect} from 'react';
import styles from './styles.module.css'
import Head from 'next/head'
import { getSession } from 'next-auth/react';
import { FiChevronDown,FiChevronUp } from 'react-icons/fi'
import {FaTrash } from 'react-icons/fa'

import db from '../../services/firebaseConnection'

import LineChart from '../../components/linechart/LineChart'


import {  collection, query, orderBy, where, onSnapshot, doc, deleteDoc,  getDocs} from 'firebase/firestore'

import Link from 'next/link';
import React from 'react';
import SimpleCloud from '../../components/wordcloud/WordCloud';

interface HomeProps {
    user: {
        id: string;
        name: string;
    }
}

interface TwitterProps {
id: string,
created: Date,
tweets: { [key: string]: any }[],
cloudImg:{ [key: string]: any }[],
//cloudImg: Map<string, any[]>,
keyword: string,
userId: string
userName: string
}

export default function Dashboard({ user  }:HomeProps){

    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedIndices, setExpandedIndices] = useState([]);
    const [input, setInput] = useState('')
    const [publicTask, setPublicTask] = useState(false)
    const [keywords, setKeywords] = useState<TwitterProps[]>([])


    useEffect(() => { 
        async function loadTasks() {
            const keywordRef = collection(db, "keyword")
            const q = query(
                keywordRef,
                orderBy("created", "desc"),
                where('userId','==', user.id)
            )
            onSnapshot(q, (snapshot) => {
               let list = [] as TwitterProps[];
               snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    created: doc.data().created,
                    tweets: doc.data().tweets,
                    cloudImg: doc.data().cloudImg,
                    keyword: doc.data().keyword,
                    userId: doc.data().userId,
                    userName: doc.data().name
                });
               });

               //console.log("o cloudImg é:", list[0]['cloudImg']);
               setKeywords(list);

            })
        }
        loadTasks();
    }, [user.id])

   


        async function handleDeleteTask(id:string){

            const docRef = doc(db, 'keyword', id)

            const queryTweets = query(collection(db, 'tweets'),where('idTweet', '==', id))

            const snapshotComments = await getDocs(queryTweets)

            await deleteDoc(docRef)

            await snapshotComments.forEach((item) => {

                const docRefComment = doc(db, 'tweets', item.id)

                deleteDoc(docRefComment)


             })


        }

        const handleToggleExpand = (id) => {
            //setIsExpanded(!isExpanded);
            //setExpandedIndex(id === expandedIndex ? -1 : id);
            if (expandedIndices.includes(id)) {
                setExpandedIndices(expandedIndices.filter((i) => i !== id));
              } else {
                setExpandedIndices([...expandedIndices, id]);
              }
          };
    
    return(
        <div className={styles.container}>
            <Head>
                <title>My Dashboard</title>
            </Head>

            <main>
            <section className={styles.content}>
            <h1>My Tweets:</h1>

            {keywords.map((item) => (
            //<ul className={styles.tweetContent}>
            <ul className={styles.keyword}>
                <ul className={styles.keywordButtons} key={item.id}>
                    <Link href={`/tweet/${item.id}`}>
                        <p>{item.keyword}</p>
                    </Link>
                    <button className={styles.trashButton}>
                        <FaTrash
                            size={18}
                            color="#ea3140"
                            onClick={() => handleDeleteTask(item.id)}
                        />
                    </button>
                
                {expandedIndices.includes(item.id)  ? 

                <button className={styles.expandButton}>
                <FiChevronUp
                size={18}
                color="#FFF"
                onClick={() => handleToggleExpand(item.id)}
            /></button>
            : 
            <button className={styles.expandButton}>
                        <FiChevronDown
                            size={18}
                            color="#FFF"
                            onClick={() => handleToggleExpand(item.id)}
                        /></button>
                        
            }
               </ul> 
                
                {expandedIndices.includes(item.id) &&  (
                <ul  className=
                //{styles.lineAndCloud}
                {`${styles.lineAndCloud}
                ${
                    //TODO Transiction not working
                     styles.expanded 
                }`}
                >
                <LineChart data={item['tweets'].map((tweet) => tweet.polarity)}
                    labels={item['tweets'].map((tweet) => tweet.created_at)} />
                <SimpleCloud data={item['cloudImg']} />
                
                </ul>
                    )}
            </ul>

                

                    //</ul>
                    ))}

                    </section>
            </main>
        </div>


    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req })

    // console.log(session)
    if(!session?.user){
        return{
            redirect:{
                destination:'/',
                permanent: false
            }
        }
    }
    return{
        props: {
            user: {
                name: session?.user.name,
                id: session?.user.email,
            }
        },
    };
};
