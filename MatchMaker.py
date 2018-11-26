# -*- coding: utf-8 -*-
"""
Created on Sun Nov 25 21:21:26 2018

@author: Nirmal Dalmia
"""

import json
import string
import re, math
from collections import Counter

WORD = re.compile(r'\w+')

def get_cosine(vec1, vec2):
     intersection = set(vec1.keys()) & set(vec2.keys())
     numerator = sum([vec1[x] * vec2[x] for x in intersection])

     sum1 = sum([vec1[x]**2 for x in vec1.keys()])
     sum2 = sum([vec2[x]**2 for x in vec2.keys()])
     denominator = math.sqrt(sum1) * math.sqrt(sum2)

     if not denominator:
        return 0.0
     else:
        return float(numerator) / denominator

def text_to_vector(text):
     words = WORD.findall(text)
     return Counter(words)

def cosine_find(text1, text2):
    vector1 = text_to_vector(text1)
    vector2 = text_to_vector(text2)
    cosine = get_cosine(vector1, vector2)
    print ('Cosine:', cosine)
    return cosine


database = dict()
start = 1
end = 250

user_key = ' '
with open('user.json') as json_file2:  
    data = json.load(json_file2)
    p = data["1"]
    keywords2 = p["personalityStemmed"]
    user_key =  user_key.join(keywords2)
    user_key=user_key.translate(str.maketrans("","",string.punctuation))
    gender = p["gender"]
    if gender=='Male':
        start = 1
        end = 251
    else:
        start = 251
        end = 501

with open('personality.json') as json_file:  
    database = json.load(json_file)
    for i in range(1, 501):
        p = database[str(i)]
        keywords = p["personalityStemmed"] 
        stem_key = ' '
        stem_key = stem_key.join(keywords)
        stem_key=stem_key.translate(str.maketrans("","",string.punctuation))
        p["personalityStemmedText"]=stem_key
        p['score'] = 0
        
        
for i in range(start, end):
    p = database[str(i)]
    stem_key = p["personalityStemmedText"]
    p["score"]= cosine_find(stem_key, user_key)
    # print(start)
    # print(end)
    
database2 = sorted(database.items(), key=lambda y: y[1]['score'], reverse=True)

f = open("results.txt", "w")
for i in range(0,20):
    p = database2[i][1]
    f.write(database2[i][0] + '\t' + p['name'] + '\t' + str(p['score']))
    f.write('\n')



