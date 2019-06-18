
//  #region  Get Slot COUNTER

curl -X POST "http://localhost:9200/slots/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "should": [
        { "match": { "ec_id":"ec1" }},
        { "match": { "last_slot":"Y" }}
      ]
    }
  }
}'
curl -X POST "http://localhost:9200/slots/_update_by_query" -H 'Content-Type: application/json' -d'
{
  "query": {
     "term" : {"slot_counter" : 4}
           },
 "script" : {"inline" : "ctx._source.last_slot =\"Y\";"}
}'

curl -X GET "http://localhost:9200/slots/_search?size=14" -H 'Content-Type: application/json' -d' 
{
"query": {
 "match":{
  "ec_id" : "ec1"
  }
 }
}'
curl -X POST "http://10.42.0.1:9200/slots/_update_by_query" -H 'Content-Type: application/json' -d'
{
  "query": {
     "term" : {"slot_id" : "ec1_59"}
           },
"script" : {"inline" : "ctx._source.current_Highest_bid =10;ctx._source.second_Highest_bid =9;"}
}'
