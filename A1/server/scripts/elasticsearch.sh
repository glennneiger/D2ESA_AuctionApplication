
//  #region  Customers

curl -X PUT "localhost:9200/consumer/_doc/harish_09031990?pretty" -H 'Content-Type: application/json' -d'
{
  "c_id" : "harish_09031990",
  "age" : 27,
  "user" :[
   {
     "bid_id" : "ec1_1_pakala_09031990_1",
     "win" : "N",
     "bid_amount" : "1.24"
   },
   {
     "bid_id" : "ec2_1_pakala_09031990_1",
     "win" : "Y",
     "bid_amount" : "1.26"
   }
  ]
}
'
curl -X PUT "localhost:9200/consumer/_doc/pakala_09061990?pretty" -H 'Content-Type: application/json' -d'
{
  "c_id" : "pakala_09061990",
  "age" : 28,
  "user" :[
   {
     "bid_id" : "ec1_1_pakala_09061990_2",
     "win" : "Y",
     "bid_amount" : "1.25"
   },
   {
     "bid_id" : "ec2_1_pakala_09061990_2",
     "win" : "N",
     "bid_amount" : "1.25"
   }
  ]
}
'
// #endregion

#================== Bids ========================================

curl -X PUT "localhost:9200/bids/_doc/ec1_1_pakala_09031990_1?pretty" -H 'Content-Type: application/json' -d'
{
  "bid_id" : "ec1_1_pakala_09031990_1",
  "ec_id"  : "ec1",
  "slot_id" : "ec1_1",
  "c_id" : "harish_09031990",
  "bid_type" : "L",
  "baseprice" : "1",
  "current_Highest_bid" : "1.26",
  "second_Highest_bid" : "Y"
}
'

curl -X PUT "localhost:9200/bids/_doc/ec2_1_pakala_09031990_1?pretty" -H 'Content-Type: application/json' -d'
{
  "bid_id" : "ec2_1_pakala_09031990_1",
  "ec_id"  : "ec2",
  "slot_id" : "ec2_1",
  "c_id" : "harish_09031990",
  "bid_type" : "W",
  "baseprice" : "1",
  "current_Highest_bid" : "1.26",
  "second_Highest_bid" : "N"
}
'
curl -X PUT "localhost:9200/bids/_doc/ec1_1_pakala_09061990_2?pretty" -H 'Content-Type: application/json' -d'
{
  "bid_id" : "ec1_1_pakala_09061990_2",
  "ec_id"  : "ec1",
  "slot_id" : "ec1_1",
  "c_id" : "pakala_09061990",
  "bid_type" : "W",
  "baseprice" : "1",
  "current_Highest_bid" : "1.25",
  "second_Highest_bid" : "N"
}
'
curl -X PUT "localhost:9200/bids/_doc/ec2_1_pakala_09061990_2?pretty" -H 'Content-Type: application/json' -d'
{
  "bid_id" : "ec2_1_pakala_09061990_2",
  "ec_id"  : "ec2",
  "slot_id" : "ec2_1",
  "c_id" : "pakala_09061990",
  "bid_type" : "L",
  "baseprice" : "1",
  "current_Highest_bid" : "1.25",
  "second_Highest_bid" : "Y"
}
'
#======================================Bid Update =======================================================


curl -XPOST "localhost:9200/bids/_update_by_query" -H "Content-Type: application/json" -d '
{
    "query": {
                "term" : {
		                        "bid_id" : "ec1_1_pakala_09061990_2"
        	  		          }

		          },
    "script" : {"inline" : "ctx._source.bid_type = 'L';ctx._source.second_Highest_bid = 'Y';"}
}'


#========================================Current Bid EC1 ================================================

curl -X PUT "localhost:9200/chbid/_doc/ec2_1?pretty" -H 'Content-Type: application/json' -d'
{
  "bid_id" : "ec2_1_pakala_09061990_2",
  "ec_id"  : "ec2",
  "slot_id" : "ec2_1",
  "baseprice" : "1",
  "bid_price" : "1.25",
  "second_Highest_bid_price" : "1.24"
}
'

#========================================Current Bid EC2 ================================================



#========================================Current Bid EC3 ================================================









#=======================================Initial Bids===================================

curl -X PUT "localhost:9200/ibids/_doc/ec2_1?pretty" -H 'Content-Type: application/json' -d'
{
  "ec_id"  : "ec2",
  "slot_id" : "ec2_1",
  "baseprice" : "1"
}'
