require('dotenv').config();
sw = require('stopword');
var stemmer = require('stemmer');
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
var user = require('./user.json');
const v3EnglishTextSummaries = new PersonalityTextSummaries({
  locale: 'en',
  version: 'v3'
});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('What is your gender? Male or Female?: ', (gender) => {
    rl.question('Enter a description of yourself: ', (about) => {
        user[1].about = about;
        user[1].gender = gender;
        about = aboutExpand(user[1].about, 1);
    })
})
// PersonalityProfiling();

function writeToFile() {
  fs.writeFile("./user.json", JSON.stringify(user, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("Successfully created user!");
  });
}

function aboutExpand(about, i) {
  let str = about;
  while ((about.split(' ').length) < 100) {
    about = about + str;
  }
  PersonalityAnalysis(about, i);
  return about;
}

// function PersonalityProfiling() {
//   var i;
//   for (i = 1; i <= 5; i++) {
//     about = aboutExpand(data[i].about, i);
//   }
// }

function PersonalityAnalysis(about, i) {
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
    const personalityKeywords = sw.removeStopwords(personalityText.split(" "));
    user[i].personality = personalityText;
    user[i].personalityKeywords = personalityKeywords;
    var personalityStemmed = [];
    for (var j = 0; j < personalityKeywords.length; j++) {
      personalityStemmed.push(stemmer(personalityKeywords[j]))
    }
    user[i].personalityStemmed = personalityStemmed;
    writeToFile();
    return (personalityText);
  });
}

function getTextSummary(personalityProfile) {
  let textSummary = v3EnglishTextSummaries.getSummary(personalityProfile);
  if (typeof (textSummary) !== 'string') {
    console.log("Could not get summary.");
  } else {
    return textSummary;
  }
}
// rl.close();


