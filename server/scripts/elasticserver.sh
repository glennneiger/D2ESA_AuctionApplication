
#region  Slots

curl -X PUT "10.42.0.1:9200/slots/_doc/ec1_1?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_1",
   "baseprice" : 1,
   "current_Highest_bid" : 1.25,
   "second_Highest_bid" : 1.24,
   "last_slot" : "N",
   "slot_counter" : 1,
   "no_bidders" : 10,
   "date_time" : "2019-01-03 12:50:04",
   "c_id" : "www1"
}
'
curl -X PUT "10.42.0.1:9200/slots/_doc/ec1_2?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_2",
   "baseprice" : 1,
   "current_Highest_bid" : 1.25,
   "second_Highest_bid" : 1.24,
   "last_slot" : "N",
   "slot_counter" : 2,
   "no_bidders" : 10,
   "date_time" : "2019-01-03 12:51:04",
   "c_id" : "www2"
}
'
curl -X PUT "10.42.0.1:9200/slots/_doc/ec1_3?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_3",
   "baseprice" : 1,
   "current_Highest_bid" : 1.25,
   "second_Highest_bid" : 1.24,
   "last_slot" : "N",
   "slot_counter" : 3,
   "no_bidders" : 10,
   "date_time" : "2019-01-03 12:52:04",
   "c_id" : "www3"
}
'
curl -X PUT "10.42.0.1:9200/slots/_doc/ec1_4?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_4",
   "baseprice" : 1,
   "current_Highest_bid" : 1.25,
   "second_Highest_bid" : 1.24,
   "last_slot" : "N",
   "slot_counter" : 4,
   "no_bidders" : 10,
   "date_time" : "2019-01-03 12:53:04",
   "c_id" : "www4"
}
'
curl -X PUT "10.42.0.1:9200/slots/_doc/ec1_5?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_5",
   "baseprice" : 1,
   "current_Highest_bid" : 1.26,
   "second_Highest_bid" : 1.24,
   "last_slot" : "N",
   "slot_counter" : 5,
   "no_bidders" : 11,
   "date_time" : "2019-01-03 12:55:04",
   "c_id" : "www5"
}
'
curl -X PUT "10.42.0.1:9200/slots/_doc/ec1_6?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_6",
   "baseprice" : 1,
   "current_Highest_bid" : 1.28,
   "second_Highest_bid" : 1.24,
   "last_slot" : "Y",
   "slot_counter" : 6,
   "no_bidders" : 12,
   "date_time" : "2019-01-03 12:56:04",
   "c_id" : "www6"
}
'
#endregion


#region Bids	

curl -X PUT "localhost:9200/nbids/_doc/ec1_6_1?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec1",
   "slot_id" : "ec1_6"
   "bid_id" : "ec1_6_1",
   "c_id" : "ccc",
   "bid_price"   : 2.3
}
'
#endregions

#region Customer
curl -X PUT "localhost:9200/consumer/_doc/ccc?pretty" -H 'Content-Type: application/json' -d'
{
	"c_id" :"ccc",
	"age" : 22
}
'


script" : {"inline" : "ctx._source.current_Highest_bid ="+str(wbd)+";ctx._source.second_Highest_bid ="+str(shb)+";ctx._source.no_bidders ="+str(nbidders)+";ctx._source.c_id ="+str(wcid)+";"}


 "script" : {"inline" : "ctx._source.last_slot =\"N\";"},


json.dumps({
                  "query": {"term" : {"slot_id" : slot_id}},
                "script" : {"inline" : "ctx._source.current_Highest_bid ="+str(wbd)+";ctx._source.second_Highest_bid ="+str(shb)+";ctx._source.no_bidders ="+str(nbidders)+";ctx._source.c_id ="+str(wcid)+";"},
                		});

_mapping/_doc
{
  "properties": {
    "date_time": { 
      "type":     "text",
      "fielddata": true
    }
  }
}






























