#!/usr/bin/env python3

import random
import json
import urllib2
from pprint import pprint as pp

random.seed(119)

word_site = "http://svnweb.freebsd.org/csrg/share/dict/words?view=co&content-type=text/plain"
response = urllib2.urlopen(word_site)
txt = response.read()
word_candidates = txt.splitlines()

n_doc = 50
min_words = 100
max_words = 150
output = "dummy_large.json"

#n_doc = 3
#min_words = 10
#max_words = 15
#output = "dummy_small.json"

document = []
error_rate = []
answer = []
predict = []
rgb = []
for doc in xrange(n_doc):
  doc_length = random.randint(min_words, max_words)
  words = [random.choice(word_candidates) for _ in xrange(doc_length)]
  document.append(" ".join(words))
  
  error_rate.append(max(random.gauss(0.4, 0.1), 0.0001))
  
  answer.append(random.randint(0, 19))

  pred_doc = []
  rgb_doc = []
  for epoch in xrange(100):
    pred_doc.append(random.randint(0, 19))
    rgb_epoch = []
    for word in xrange(len(document[doc].split(' '))):
      rgb_epoch.append([random.uniform(0.0, 1.0) for _ in xrange(3)])
    rgb_doc.append(rgb_epoch)
      
  predict.append(pred_doc)
  rgb.append(rgb_doc)

dic = {
  "document": document,
  "answer": answer,
  "error_rate": error_rate,
  "predict": predict,
  "rgb": rgb
}

with open(output, 'w') as f:
  j = json.dump(dic, f)
