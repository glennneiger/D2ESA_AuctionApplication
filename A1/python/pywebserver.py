from http.server import HTTPServer, BaseHTTPRequestHandler
import ssl
from io import BytesIO
import xmlrpc.client
import requests
import json
import uuid

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def h1(self,body):
        print("ss")

    def insertCustomerData(self,c_id,age):
        headers = {
                'Content-type': 'application/json',
                }
        with open('../server/config.json', encoding='utf-8') as data_file:
            data = json.loads(data_file.read())

        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/consumer/_search'
        doc = json.dumps(
                        {
                          "query":
                            {
                              "match": { "c_id":str(c_id)}
                            }
                          }
                    )
        res = requests.post(url, headers=headers, data=(doc))
        djson = res.json()
        total = djson['hits']['total']
        if (total == 1):
            uuuid = djson['hits']['hits'][0]['_source']['uuid']
            return "1_"+uuuid
        else :
            uuuid = str(uuid.uuid4())
            url2 = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/consumer/_doc/'+str(uuuid)+'?pretty'
            doc = {
                  "c_id" : str(c_id),
                  "uuid" : uuuid,
                  "age" : age,
                }

            res = requests.put(url2, headers=headers, data=json.dumps(doc))

            return "1_"+uuuid

    def getSlotCounter(self,ec):
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
            print(slotCounter)
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

    def getSlotsData(self):
        doc = json.dumps(
                {
                    "query" : {
                        "match_all" : {}
                    }
                })

        headers = {
                'Content-type': 'application/json',
                }
        slc = self.getSlotCounter("N")
        with open('../server/config.json', encoding='utf-8') as data_file:
            data = json.loads(data_file.read())
        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search?size='+str(slc)

        res  = requests.post(url, headers=headers ,data=(doc))
        jData = json.dumps(res.text)
        djson = res.json()
        responses  = []
        for hit in djson['hits']['hits']:
            sdata = hit['_source']
            rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+str(sdata['current_Highest_bid'])+'"'+","+ "\"no_bidders\"" + ":" + '"'+str(sdata['no_bidders'])+'"' +","+ "\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"'+"," + "\"HOST\"" + ":" + '"'+str(data["HOST"])+'"'+"," + "\"c_id\"" + ":" + '"'+str(sdata["c_id"])+'"'+","+ "\"C_S\"" + ":" + '"'+str(sdata["ec_id"])+'"' +"}"
            responses.append(rjson)
        return ('$'.join((responses)))

    def getUserData(self,c_id):
        doc = json.dumps(
                {
               "query": {
                  "match":{
                     "c_id" : c_id
                    }
                 }
                 })

        headers = {
                'Content-type': 'application/json',
                }
        with open('../server/config.json', encoding='utf-8') as data_file:
            data = json.loads(data_file.read())
        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search?size=20'

        res  = requests.post(url, headers=headers ,data=(doc))
        jData = json.dumps(res.text)
        djson = res.json()
        responses  = []
        for hit in djson['hits']['hits']:
            sdata = hit['_source']
            rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+ str(sdata['current_Highest_bid'])+'"'+","+ "\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"'+"," + "\"c_id\"" + ":" + '"'+str(sdata['c_id'])+'"'+","+"\"amount\"" + ":" + '"'+(str(sdata['amount']))[0:9]+'"' +"}"
            responses.append(rjson)
        return ('$'.join((responses)))

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.end_headers()
        response = BytesIO()
        input_Data = body.decode("utf-8").split('&')
        c_id=((input_Data[0]).split('=')[1])
        age =((input_Data[1]).split('=')[1])
        it_type =((input_Data[2]).split('=')[1])
        print(age)
        if (it_type == "1"):
            response = BytesIO()
            re = bytes(self.insertCustomerData(c_id,age),'utf-8')
            response.write(re)
            self.wfile.write(response.getvalue())
        elif (it_type == "5"):
            response = BytesIO()
            ref = bytes(self.getSlotsData(),'utf-8')
            response.write(ref)
            self.wfile.write(response.getvalue())
        elif (it_type == "6"):
            response = BytesIO()
            ref = bytes(self.getUserData(c_id),'utf-8')
            response.write(ref)
            self.wfile.write(response.getvalue())

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Hello, world')

data = {}
with open('../server/config.json', encoding='utf-8') as data_file:
    data = json.loads(data_file.read())

httpd = HTTPServer((data["HOST"], data["PYSERVER"]), SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket,
        keyfile="../config/settings/key.pem",
        certfile='../config/settings/cert.pem', server_side=True)

httpd.serve_forever()
