import ssl
from io import BytesIO
import xmlrpc.client
import requests
import json
import sched, time
from aiohttp import web
import socketio
import datetime

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
def getSlotCounter():
    doc = json.dumps({
                      "query": {
                        "bool": {
                          "should": [
                            { "match": { "ec_id":"ec1" }},
                            { "match": { "last_slot":"Y" }}
                          ]
                        }
                      }
                    })
    headers = {'Content-type': 'application/json',}

    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_search'

    res  = requests.get(url, headers=headers ,data=(doc))
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
                         "term" : {"slot_counter" : _slc}
                               },
                      "script" : {"inline" : "ctx._source.last_slot =\"N\";"},
                    });
    headers= {'Content-type': 'application/json',};
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_update_by_query'

    requests.post(url, headers=headers ,data=(doc));

def pushLatestSlots(slc):
    doc = json.dumps(
                  {
                   "query": {
                      "match":{
                    	 "ec_id" : "ec1"
                    	}
                     },
                    "sort" : {"date_time":"desc"
                           }
                     })
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_search?size='+str(slc)

    res  = requests.get(url, headers=headers ,data=(doc))
    jData = json.dumps(res.text)
    djson = res.json()
    responses  = []
    for hit in djson['hits']['hits']:
        sdata = hit['_source']
        rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+str(sdata['current_Highest_bid'])+'"' +","+ "\"no_bidders\"" + ":" + '"'+str(sdata['no_bidders'])+'"' +","+"\"c_id\"" + ":" + '"'+str(data["c_id"])+'"'+","+"\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"' +"}"
        responses.append(rjson)
    return ('$'.join((responses)))

def bidPricenSHB(slot_id,wbd,shb):
    doc = json.dumps({
                  "query": {
                     "term" : {"slot_id" : slot_id}
                           },
                "script" : {"inline" : "ctx._source.current_Highest_bid ="+str(wbd)+";ctx._source.second_Highest_bid ="+str(shb)+";"}
                });
    headers= {'Content-type': 'application/json',};
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_update_by_query'

    requests.post(url, headers=headers ,data=(doc));


@sio.on('newBid')
async def insertNewBid(sid,data):
    message = data.split("$");
    global newBids
    global current_Highest_bid
    global current_second_bid
    global bidCounter
    global slot_id
    global bid_id
    b_BidPrice = float(message[0])
    b_cid = message[1]
    b_slotid = slot_id

    if (b_BidPrice > current_Highest_bid):
        tmp = current_Highest_bid
        current_Highest_bid = b_BidPrice
        current_second_bid = tmp
        await sio.emit('AUCTION_SBID_UPDATE', {'current_second_bid':current_second_bid})
        bid_id = slot_id+"_"+str(bidCounter)
    newBids[slot_id+"_"+str(bidCounter)] = [b_BidPrice,b_cid,b_slotid]
    bidCounter = bidCounter + 1

async def insertNewSLotID(baseprice):
    slc = getSlotCounter()
    lsids = pushLatestSlots(slc)
    await sio.emit('AUCTION_COMPLETED_MESSAGES', {'data': lsids})
    updateActiveStatus(slc)
    new_slt_counter = slc+1
    global slot_id
    global current_Highest_bid
    global current_second_bid
    slot_id = "ec1_"+str(new_slt_counter)
    current_Highest_bid = baseprice
    current_second_bid = baseprice
    cdt = datetime.datetime.now()
    doc = {
            "ec_id"  : "ec1",
            "slot_id" : slot_id,
            "baseprice" : baseprice,
            "current_Highest_bid" : baseprice,
            "second_Highest_bid" : baseprice,
            "last_slot" : "Y",
            "slot_counter" : new_slt_counter,
            "no_bidders" : 0,
             "date_time" : str(cdt)
          };
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    url = 'http://'+ str(data["HOST"])+":"+str(data["ESNODE"])+'/slots/_doc/'+slot_id+'?pretty'

    res  = requests.put(url, headers=headers, data=json.dumps(doc))
    sio.start_background_task(background_task,slc)

async def counter_stop(slc):
    await sio.emit('AUCTION_STOP_NOTIFICATION', {'data': 'The auction with slotid is ended'})
    cCheck = 10
    cBool = True
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    while cBool:
        await sio.sleep(1)
        cCheck -= 1
        if (cCheck == 0):
            await sio.emit('AUCTION_IDLE', {'data': 'Currently no auctions are open'})
            cBool = False
    global newBids
    global headers
    for key in newBids.keys():
        message = newBids[key]
        jdoc = json.dumps({
                      "ec_id"  : "ec1",
                      "slot_id" : message[2],
                      "bid_id" : key,
                      "c_id" : message[1],
                      "bid_price":message[0]
                    })
        print(key)
        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/nbids/_doc/'+str(key)+'?pretty'
        res  = requests.put(url, headers=headers, data=(jdoc))
        print(res.text)
    global current_Highest_bid
    global current_second_bid
    global slot_id
    bidPricenSHB(slot_id,current_Highest_bid,current_second_bid)
    lsids = pushLatestSlots(slc+1)
    await sio.emit('AUCTION_COMPLETED_MESSAGES', {'data': lsids})
async def counter_start(slc):
    global second_Highest_bid
    count = 60
    counterCheck = True
    while counterCheck:
        await sio.sleep(1)
        count -= 1
        await sio.emit('AUCTION_COUNTER', {'data': 'New auction is started, its slotid  is' + slot_id,'current_second_bid':current_second_bid,'counter' : count})
        if count == 0:
            sio.start_background_task(counter_stop,slc)
            counterCheck = False

async def background_task(slc):
    count = 0
    while True:
        await sio.sleep(10)
        await sio.emit('AUCTION_START_NOTIFICATION', {'data': 'New auction is started, its slotid  is ' + slot_id,'current_second_bid':current_second_bid}) #
        await sio.sleep(5)
        sio.start_background_task(counter_start,slc)
        break;

def endServer():
    httpd.shutdown()

if __name__ == '__main__':
    with open('../server/config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
    basePrice  = 1.24
    sio.start_background_task(insertNewSLotID,basePrice)
    web.run_app(app,host = data["HOST"], port=data["EC1"])
    #s.run()
#EC1()
