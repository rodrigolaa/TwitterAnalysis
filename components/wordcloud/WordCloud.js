import React from 'react';
import { TagCloud } from 'react-tagcloud'
import styles from './styles.module.css'

const SimpleCloud  = (props) => {
if (typeof window !== "undefined") {
  const words = props.data


  // Sort the list in descending order based on the 'count' field
  words.sort((a, b) => b.count - a.count);

  // Take the first 100 items from the sorted list
  const words100 = words.slice(0, 1000);


  return (
    <div className={styles.container}>
    <TagCloud tags={words100} 
        minSize={8}
        maxSize={35}
      onClick={tag => alert(`'${tag.count}' was selected!`)} />   
    </div>
  );
};


  }
export default SimpleCloud;
