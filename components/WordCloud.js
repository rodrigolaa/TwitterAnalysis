import React from 'react';
// import ReactWordcloud from 'react-wordcloud';
// import WordCloud from 'wordcloud';

if (typeof window !== "undefined") {
const words = [
  { text: 'Lorem', value: 10 },
  { text: 'Ipsum', value: 8 },
  { text: 'Dolor', value: 7 },
  { text: 'Sit', value: 6 },
  { text: 'Amet', value: 5 },
  { text: 'Consectetur', value: 4 },
  { text: 'Adipiscing', value: 3 },
  { text: 'Elit', value: 2 },
  { text: 'Fusce', value: 1 },
  { text: 'Volutpat', value: 1 },
];

const options = {
  colors: ['#000'],
  enableTooltip: false,
  deterministic: false,
  fontFamily: 'sans-serif',
  fontSizes: [12, 60],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

const WordCloudNext = () => {
  return <WordCloud words={words} options={options} />;
};


    // browser code
  }
const WordCloudNext = []

export default WordCloudNext;