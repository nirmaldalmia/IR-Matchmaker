# Personality Matchmaker
This is a final project of my course Information Retrieval. The aim of the project is to find a match for the users based on their personality. We've created a small database of 500 profiles (250 male and 250 female). The new user needs to create a profile and then run the matchmaker to get the list of top 10 matches which are saved in a text file.


### Getting Started

1. You need to have node.js and Python installed in order to run this project.
2. You need to create a Personality Insights service instance on IBM Cloud to generate credentials to use the Watson Personality Insights API. There's a short tutorial [here](https://medium.com/ibm-watson-tutorials/getting-started-with-ibm-watson-95b10ca145f6).
3. Clone this repository using
    ```
    git clone https://github.com/nirmaldalmia/IR-Matchmaker
    ```
4. Create a `.env` file in the root directory. The `.env` file will look something like the following:
    ```
    PERSONALITY_INSIGHTS_API_KEY = <your_api_key>
    PERSONALITY_INSIGHTS_API_URL = <your_api_url>
    ```
5. Install all the dependencies by running `npm install` in the root directory.

### Execution
1. Create your profile by running `node CreateProfile.js`. <br />
    You need to provide your gender and a description of yourself (minimum 100 words for accurate results). A `user.json` file will be generated with your details.
2. Run the matchmaking engine by using `python MatchMaker.py`. <br />
    The engine matches your profile against all the profiles in the databse and finds the top 10 matching personalities. The results are written to a `results.txt` file.

### Code Breakdown
- `PersonalityInsight.js` contains the code to crawl the entire database (`data.json`) and performs a personality analysis on it. The results are written to `personality.json` file. <br />
    The engine works by picking up the user's description and dumping it onto the IBM Watson API. The result is a metrics of various personality traits. This result is sent to another `personality-text-summary` library which analyzes the metrics and generates a text description of the personality. This text is tokenized, stemmed and then stored.
- `CreateProfile.js` generates a profile for the current user. The same process of personality analysis is applied as in the `PersonalityInsight.js` file to generate personality profile for the user. The results are saved onto `user.json` file.
- `MatchMaker.py` is the matchmaking engine that matches the user profile with the database and finds the top 10 matches. The results are written to a `results.txt` file. <br />
    The personalities are matched based on cosine similarity.
- `data.json` file contains the sample 500 profiles. It contains 250 male and 250 female profile. The keys `1-250` correspond to female profiles and `251-500` for male profiles. <br /> 
    Feel free to add your own profiles but keep the structure of json same so that the code doesn't break. There's also a sample with the key `"0"` for your reference.
- `sampleresponse.json` contains a sample response from the IBM Watson API. Incase you are curious, you can go ahead and explore the metrics to write your own matchmaking algorithm.


##### Special thanks to [@agrawalshivam66](https://github.com/agrawalshivam66) for helping me with the Python code.
