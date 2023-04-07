
import { GetServerSideProps } from 'next';
import {  useState, useEffect} from 'react';
import styles from './styles.module.css'
import Head from 'next/head'
import { getSession } from 'next-auth/react';
import { FiChevronDown} from 'react-icons/fi'
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
keyword: string,
userId: string
userName: string
}

export default function Dashboard({ user  }:HomeProps){

    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('')
    const [publicTask, setPublicTask] = useState(false)
    const [keywords, setKeywords] = useState<TwitterProps[]>([])

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
      };

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

               //console.log("a tweets é:", list[0]['tweets'][0]['created_at']);
               setKeywords(list);

            })
        }
        loadTasks();
    }, [user.id])

   
    


    // function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    //     setPublicTask(event.target.checked)
    // }

    // async function handleNewKeyword(event) {
    //     event.preventDefault();
    //     if( input === "") return;

    //     try{
    //     await addDoc(collection(db, "keywords"), {
    //         keyword: input,
    //         created: new Date(),
    //         userId: user.id,
    //         name: user.name,
    //     });

    //     setInput("")
    //     setPublicTask(false)

    //     // toast.success("Tarefa registrada com sucesso!")
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }

    //     }

    //     async function handleShare(id:string) {
    //         await navigator.clipboard.writeText(
    //             `${process.env.NEXT_PUBLIC_URL}/tweet/${id}`
    //         );

    //         alert("URL copied!")
    //     }

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


    return(
        <div className={styles.container}>
            <Head>
                <title>My Dashboard</title>
            </Head>

            <main>
            <section className={styles.content}>
            <h1>My Tweets:</h1>

            {keywords.map((item) => (
            <ul className={styles.tweetContent}>
            <li key={item.id} className={styles.keyword}>
                <li>
                    <button className={styles.trashButton}>
                        <FaTrash
                            size={18}
                            color="#ea3140"
                            onClick={() => handleDeleteTask(item.id)}
                        />
                    </button>
                </li>
                <li>
                <button className={styles.expandButton}>
                        <FiChevronDown
                            size={18}
                            color="#ea3140"
                            onClick={() => handleToggleExpand()}
                        />
                        {isExpanded ? 'Hide' : 'Expand'}
                    </button>
            </li>
                <li>
                    <Link href={`/tweet/${item.id}`}>
                        <p>{item.keyword}</p>
                    </Link>
                </li>
                </li>
                {isExpanded && (
                <section>
                <LineChart data={item['tweets'].map((tweet) => tweet.polarity)}
                    labels={item['tweets'].map((tweet) => tweet.created_at)} />
                <SimpleCloud data={item['cloudImg']} />
                
                </section>
                    )}
                     </ul>
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
