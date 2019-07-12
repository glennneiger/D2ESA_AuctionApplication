import ssl
from io import BytesIO
import xmlrpc.client
import requests
import json
import sched, time
from aiohttp import web
import socketio
from requests.auth import HTTPBasicAuth
import datetime
import urllib

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)
headers = {
        'Content-type': 'application/json',
        }
slot_id = ''

current_Highest_bid = 0
current_second_bid = 0
newBids = {}
bidCounter = 1
bid_id = ''
c_id = ''
_baseprice = 0
status = False
finalreading = 0

def getSlotCounter(ec):
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search'
    slotCounter1 = 0
    slotCounter2 = 0
    slotCounter3 = 0
    slotCounter = 0
    headers = {'Content-type': 'application/json',}
    if(ec == "N"):
        doc1 = json.dumps({
                      "query": {
                        "bool": {
                          "must": [
                            { "match": { "ec_id":"ec1" }},
                            { "match": { "last_slot":"Y" }}
                          ]
                        }
                       }
                    })
        doc2 = json.dumps({
                          "query": {
                            "bool": {
                              "must": [
                                { "match": { "ec_id":"ec2" }},
                                { "match": { "last_slot":"Y" }}
                              ]
                            }
                          }
                        })
        doc3 = json.dumps({
                          "query": {
                            "bool": {
                              "must": [
                                { "match": { "ec_id":"ec3" }},
                                { "match": { "last_slot":"Y" }}
                              ]
                            }
                          }
                        })

        res1  = requests.post(url, headers=headers ,data=(doc1))
        res2  = requests.post(url, headers=headers ,data=(doc2))
        res3  = requests.post(url, headers=headers ,data=(doc3))
        djson1 = res1.json()
        djson2 = res2.json()
        djson3 = res3.json()
        for hit in djson1['hits']['hits']:
            sdata1 = hit['_source']
            slotCounter1 =  sdata1['slot_counter']
            break;
        for hit in djson2['hits']['hits']:
            sdata2 = hit['_source']
            slotCounter2 =  sdata2['slot_counter']
            break;
        for hit in djson3['hits']['hits']:
            sdata3 = hit['_source']
            slotCounter3 =  sdata3['slot_counter']
            break;
        slotCounter = slotCounter1 + slotCounter2 + slotCounter3

    else:
        doc = json.dumps({
                      "query": {
                            "bool": {
                              "must": [
                                { "match": { "ec_id":ec }},
                                { "match": { "last_slot":"Y" }}
                              ]
                            }
                          }
                        })

        res  = requests.post(url, headers=headers ,data=(doc))
        jData = json.dumps(res.text)
        djson = res.json()
        for hit in djson['hits']['hits']:
            sdata = hit['_source']
            slotCounter =  sdata['slot_counter']
            break;

    return (slotCounter)

def updateActiveStatus(_slc):
    doc = json.dumps({
                        "query": {
                        "bool": {
                          "must": [
                            { "match": { "ec_id":"ec2" }},
                            { "match": { "slot_counter":_slc }}
                          ]
                        }
                      },
                      "script" : {"inline" : "ctx._source.last_slot =\"N\";"}
                            });
    headers= {'Content-type': 'application/json',};
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_update_by_query'

    requests.post(url, headers=headers ,data=(doc));

def pushLatestSlots():
    doc = json.dumps(
            {
                "query" : {
                    "match_all" : {}
                }
            })

    headers = {
            'Content-type': 'application/json',
            }
    slc1 = getSlotCounter("N")
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search?size='+str(slc1)

    res  = requests.post(url, headers=headers ,data=(doc))
    jData = json.dumps(res.text)
    djson = res.json()
    responses  = []
    for hit in djson['hits']['hits']:
        sdata = hit['_source']
        rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+str(sdata['current_Highest_bid'])+'"'+","+ "\"no_bidders\"" + ":" + '"'+str(sdata['no_bidders'])+'"' +","+ "\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"'+"," + "\"HOST\"" + ":" + '"'+str(data["HOST"])+'"'+"," + "\"c_id\"" + ":" + '"'+str(sdata["c_id"])+'"'+","+ "\"C_S\"" + ":" + '"'+str(sdata["ec_id"])+'"' +"}"
        responses.append(rjson)
    return ('$'.join((responses)))

@sio.on('newBid')
async def insertNewBid(sid,data):
    message = data.split("$");
    global newBids
    global current_Highest_bid
    global current_second_bid
    global bidCounter
    global slot_id
    global bid_id
    global c_id
    b_BidPrice = float(message[0])
    b_cid = message[1]
    b_slotid = slot_id
    t_chb = current_Highest_bid
    t_shb = current_second_bid

    if(b_BidPrice == current_Highest_bid):
        t_shb = b_BidPrice

    if(b_BidPrice > current_Highest_bid):
        c_id = b_cid
        tmp = t_chb
        t_chb = b_BidPrice
        t_shb = tmp

    if((b_BidPrice > current_second_bid) & (b_BidPrice < current_Highest_bid )):
        t_shb = b_BidPrice

    current_Highest_bid = t_chb
    current_second_bid = t_shb

    await sio.emit('AUCTION_SBID_UPDATE', {'current_second_bid':current_second_bid})
    newBids[slot_id+"_"+str(bidCounter)] = [b_BidPrice,b_cid,b_slotid]
    bidCounter = bidCounter + 1

def insertNewSLot(slot_id,wbd,shb,wcid,nbidders,amountpayable):
    global new_slt_counter
    global _baseprice
    cdt = datetime.datetime.now()
    doc = {
               "ec_id"  : "ec2",
               "slot_id" : slot_id,
               "baseprice" : _baseprice,
               "current_Highest_bid" : wbd,
               "second_Highest_bid" : shb,
               "last_slot" : "Y",
               "slot_counter" : new_slt_counter,
               "no_bidders" : nbidders,
               "date_time" : str(cdt)[0:19],
               "amount" : amountpayable,
               "c_id" : wcid
            };
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_doc/'+slot_id+'?pretty'
    res  = requests.put(url, headers=headers, data=json.dumps(doc))

async def createtNewSLotID(baseprice):
    global slot_id
    global current_Highest_bid
    global current_second_bid
    global _baseprice
    global new_slt_counter
    _baseprice = baseprice
    current_Highest_bid = _baseprice
    current_second_bid = _baseprice

    slc = getSlotCounter("ec2")
    new_slt_counter = slc+1
    slot_id = "ec2_"+str(new_slt_counter)
    sio.start_background_task(background_task,slc)

async def counter_stop(slc):
    await sio.emit('AUCTION_STOP_NOTIFICATION', {'data': 'The auction with slotid is ended'})
    cCheck = 5
    cBool = True
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    while cBool:
        await sio.sleep(1)
        cCheck -= 1
        if (cCheck == 0):
            cBool = False
    global newBids
    global headers
    global status
    global current_Highest_bid
    global current_second_bid
    global slot_id
    global c_id
    no_bids = len(newBids.keys())
    if (no_bids > 0):
        for key in newBids.keys():
            message = newBids[key]
            jdoc = json.dumps({
                          "ec_id"  : "ec2",
                          "slot_id" : message[2],
                          "bid_id" : key,
                          "c_id" : message[1],
                          "bid_price":message[0]
                        })

            url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/nbids/_doc/'+str(key)+'?pretty'
            res  = requests.put(url, headers=headers, data=(jdoc))
        updateActiveStatus(slc)
        await sio.sleep(2)
        nslc = slc + 1
        await sio.emit('AUCTION_IDLE', {'data': 'Currently no auctions are open'})
        #updatecosnumptionAmount(slot_id,float(message[0]))
        sio.start_background_task(startSmart)
        await sio.sleep(2)
        status = False
        lsids = pushLatestSlots()
        await sio.emit('ACTIVATE_SLOT', {'data': 'true'})
        await sio.emit('SLOT_RECEIVE_MESSAGE2', {'data': lsids})
        #startSmart()
    else:
        message = "The slot id " +slot_id + " \n is not sold"
        await sio.emit('AUCTION_IDLE', {'data': message})
        await sio.sleep(5)
        await sio.emit('AUCTION_IDLE', {'data': 'Currently no auctions are open'})
        status = False
        await sio.emit('ACTIVATE_SLOT', {'data': 'true'})

async def startSmart():
    global slot_id
    #intReading = getcurrentReading()
    #StartElectricENergySupply(1)
    await sio.sleep(15)
    #StartElectricENergySupply(0)
    #finalreading = (getcurrentReading() - intReading) * current_Highest_bid
    insertNewSLot(slot_id,current_Highest_bid,current_second_bid,c_id,len(newBids.keys()),0.02*current_Highest_bid)
    #amountpay = str(finalreading) + 'euro cents'
    #updatecosnumptionAmount(slot_id,finalreading)

def updatecosnumptionAmount(sltid,amount):
    doc = json.dumps({"query":{"bool":{"must":[{"match":{"slot_id":sltid}}]}},
    "script":{"inline":"ctx._source.amount="+str(amount)+";"}});
    headers= {'Content-type': 'application/json',};
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_update_by_query'

    requests.post(url, headers=headers ,data=(doc));

async def counter_start(slc):
    global second_Highest_bid
    global slot_id
    count = 61
    counterCheck = True
    while counterCheck:
        await sio.sleep(1)
        count -= 1
        await sio.emit('AUCTION_COUNTER',  {'counter': count ,'data': 'New auction is started, \n its slotid  is ' + slot_id,'current_second_bid':current_second_bid})
        if count == 0:
            sio.start_background_task(counter_stop,slc)
            counterCheck = False

async def background_task(slc):
    count = 0
    while True:
        await sio.sleep(10)
        await sio.emit('AUCTION_START_NOTIFICATION', {'data': 'New auction is started, \n its slotid  is ' + slot_id,'current_second_bid':current_second_bid}) #
        await sio.sleep(5)
        sio.start_background_task(counter_start,slc)
        break;

def endServer():
    httpd.shutdown()

@sio.on('newSlot')
async def insertNewBid(sid,baseprice):
    global status
    status = True
    sio.start_background_task(createtNewSLotID,float(baseprice))

@sio.on('AUCTION_STATUS')
async def returnStatus(sid,baseprice):
    global status
    return status

def getcurrentReading():
    headers = {
            'Content-type': 'application/json',
            }
    now = datetime.datetime.now()
    datetimec = now.strftime('%Y-%m-%dT%H:%M:%S') + now.strftime('.%f')[:4] + 'Z'
    datetimeencoded = urllib.parse.quote_plus(datetimec)
    url = 'https://smart-me.com:443/api/MeterValues/d95c7f40-d77c-4f50-b0d4-f3f7f0fe4568?date='+datetimeencoded
    res  = requests.get(url, headers=headers,auth=HTTPBasicAuth('harish.pakala@ovgu.de', '87654321'))
    startreading = (json.loads(res.text))["CounterReadingT1"]
    return startreading

def StartElectricENergySupply(valve):

    headers = {
            'Content-type': 'application/json',
            }

    doc = json.dumps({
    	  "DeviceID": "d95c7f40-d77c-4f50-b0d4-f3f7f0fe4568",
    	  "Actions": [
    	    {
    	      "ObisCode": "63000C0001FF",
    	      "Value": valve
    	    }
    	  ]
    	})
    url = 'https://smart-me.com:443/api/Actions'
    res  = requests.post(url, headers=headers ,data=(doc),auth=HTTPBasicAuth('harish.pakala@ovgu.de', '87654321'))
    print(res.text)

if __name__ == '__main__':
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    web.run_app(app,host = data["HOST"], port=data["EC2"])
