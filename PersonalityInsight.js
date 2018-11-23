require('dotenv').config();
const readline = require('readline');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const personality_insights = new PersonalityInsightsV3({
  version: '10-12-2018',
  iam_apikey: process.env.PERSONALITY_INSIGHTS_API_KEY,
  url: process.env.PERSONALITY_INSIGHTS_API_URL
});
const PersonalityTextSummaries = require('personality-text-summary');
var fs = require("fs");
var data = require('./data.json');
var personality = require('./personality.json');
const v3EnglishTextSummaries = new PersonalityTextSummaries({
  locale: 'en',
  version: 'v3'
});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
PersonalityProfiling();


// rl.question('Please enter a short paragraph for Watson to analyze...', (text) => {

//   let params = {
//     content: text,
//     content_type: 'text/plain',
//     raw_scores: true,
//     consumption_preferences: true
//   };

//   personality_insights.profile(params, function (error, response) {
//     if (error)
//       console.log('Error:', error);
//     else
//       console.log(getTextSummary(response));
//     //console.log(JSON.stringify(response, null, 2));
//   });

//   rl.close();
// });

// const getTextSummary = personalityProfile => {
//   let textSummary = v3EnglishTextSummaries.getSummary(personalityProfile);
//   if (typeof (textSummary) !== 'string') {
//     console.log("Could not get summary.");
//   } else {
//     return textSummary;
//   }
// };

function writeToFile() {
  fs.writeFile("./personality.json", JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("Personality profiling complete!");
  });
}

function aboutExpand(about) {
  let str = about;
  while ((about.split(' ').length) < 100) {
    about = about + str;
  }
  return about;
}

var processed = 0;

function PersonalityProfiling() {
  var i, personality, about;
  for (i = 1; i <= 1; i++) {
    about = aboutExpand(data[i].about);
    personality = PersonalityAnalysis(about);
    data[i].personality = personality;
    // if (processed === 5) {
    //   writeToFile();
    // }
  }
  // writeToFile();
}

function PersonalityAnalysis(about) {
  let params = {
    content: about,
    content_type: 'text/plain',
    raw_scores: true,
    consumption_preferences: true
  };

  personality_insights.profile(params, function (error, response) {
    if (error)
      console.log('Error:', error);
    else
      var personalityText = getTextSummary(response);
    console.log(personalityText);
    return (personalityText);
    //console.log(JSON.stringify(response, null, 2));
  });
  processed++;
  if (processed === 5) {
    writeToFile();
  }
  // rl.close();
}

function getTextSummary(personalityProfile) {
  let textSummary = v3EnglishTextSummaries.getSummary(personalityProfile);
  if (typeof (textSummary) !== 'string') {
    console.log("Could not get summary.");
  } else {
    return textSummary;
  }
}

