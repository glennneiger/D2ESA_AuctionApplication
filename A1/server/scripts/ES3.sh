
#region  Slots

curl -X PUT "141.44.201.91:9200/slots/_doc/ec3_1?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_1",
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
curl -X PUT "141.44.201.91:9200/slots/_doc/ec3_2?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_2",
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
curl -X PUT "141.44.201.91:9200/slots/_doc/ec3_3?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_3",
   "baseprice" : 1,
   "current_Highest_bid" : 1.25,
   "second_Highest_bid" : 1.24,
   "last_slot" : "N",
   "slot_counter" : 3,
   "no_bidders" : 10,c2
   "date_time" : "2019-01-03 12:52:04",
   "c_id" : "www3"
}
'
curl -X PUT "141.44.201.91:9200/slots/_doc/ec3_4?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_4",
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
curl -X PUT "141.44.201.91:9200/slots/_doc/ec3_5?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_5",
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
curl -X PUT "141.44.201.91:9200/slots/_doc/ec3_6?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_6",
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

curl -X PUT "localhost:9200/nbids/_doc/ec3_6_1?pretty" -H 'Content-Type: application/json' -d'
{
   "ec_id"  : "ec3",
   "slot_id" : "ec3_6"
   "bid_id" : "ec3_6_1",
   "c_id" : "ccc",
   "bid_price"   : 2.3
}
'
#endregions
