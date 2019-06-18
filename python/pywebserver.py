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

        with open('../server/config.json', encoding='utf-8') as data_file:
            data = json.loads(data_file.read())
        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/consumer/_doc/'+str(c_id)+'?pretty'
        print(url)
        uuuid = str(uuid.uuid4())
        doc = {
                  "c_id" :uuuid,
                  "age" : age,
                }

        headers = {
                'Content-type': 'application/json',
                }
        res  = requests.put(url, headers=headers, data=json.dumps(doc))

        return "1_"+uuuid

    def getSlotCounter(self):
        with open('../server/config.json', encoding='utf-8') as data_file:
            data = json.loads(data_file.read())
        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search'

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
        res  = requests.get(url, headers=headers ,data=(doc))
        jData = json.dumps(res.text)
        djson = res.json()
        for hit in djson['hits']['hits']:
            sdata = hit['_source']
            slotCounter =  sdata['slot_counter']
            break;
        print(slotCounter)
        return (slotCounter)

    def getSC1Data(self):
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

        headers = {
                'Content-type': 'application/json',
                }
        slc = self.getSlotCounter()
        with open('../server/config.json', encoding='utf-8') as data_file:
            data = json.loads(data_file.read())
        url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search?size='+str(slc)

        res  = requests.get(url, headers=headers ,data=(doc))

        jData = json.dumps(res.text)
        djson = res.json()
        responses  = []
        for hit in djson['hits']['hits']:
            sdata = hit['_source']
            print(sdata)
            rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+str(sdata['current_Highest_bid'])+'"'+","+ "\"no_bidders\"" + ":" + '"'+str(sdata['no_bidders'])+'"' +","+ "\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"'+"," + "\"HOST\"" + ":" + '"'+str(data["HOST"])+'"'+"," + "\"c_id\"" + ":" + '"'+str(sdata["c_id"])+'"'+","+ "\"EC1\"" + ":" + '"'+str(data["EC1"])+'"' +"}"
            responses.append(rjson)
        return ('$'.join((responses)))

    def getSC2Data(self):
            doc = json.dumps({
                      "query": {
                            "match":{
                                "ec_id" : "ec2",
                                    }
                        }
                      })

            headers = {
                    'Content-type': 'application/json',
                    }
            slc = self.getSlotCounter()
            with open('../server/config.json', encoding='utf-8') as data_file:
                data = json.loads(data_file.read())
            url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search?size='+str(slc)
            res  = requests.get(url, headers=headers ,data=(doc))

            jData = json.dumps(res.text)
            djson = res.json()
            responses  = []
            for hit in djson['hits']['hits']:
                sdata = hit['_source']
                rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+str(sdata['current_Highest_bid'])+'"' +","+ "\"baseprice\"" + ":" + '"'+str(sdata['baseprice'])+'"' +","+"\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"' +"}"
                responses.append(rjson)
            return ('$'.join((responses)))

    def getSC3Data(self):

            doc = json.dumps({
                      "query": {
                            "match":{
                                "ec_id" : "ec3",

                                }
                        }
                      })

            headers = {
                    'Content-type': 'application/json',
                    }
            slc = self.getSlotCounter()
            with open('../server/config.json', encoding='utf-8') as data_file:
                data = json.loads(data_file.read())
            url = 'http://'+ str(data["HOST"])+':'+str(data["ESNODE"])+'/slots/_search?size='+str(slc)
            res  = requests.get(url, headers=headers ,data=(doc))
            jData = json.dumps(res.text)
            djson = res.json()
            responses  = []
            for hit in djson['hits']['hits']:
                sdata = hit['_source']
                rjson =  "{"+ "\"current_Highest_bid\"" + ":" + '"'+str(sdata['current_Highest_bid'])+'"' +","+ "\"baseprice\"" + ":" + '"'+str(sdata['baseprice'])+'"' +","+"\"slot_id\"" + ":" + '"'+str(sdata['slot_id'])+'"' +"}"
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
        print(it_type)
        if (it_type == "1"):
            response = BytesIO()
            re = bytes(self.insertCustomerData(c_id,age),'utf-8')
            response.write(re)
            self.wfile.write(response.getvalue())
        elif (it_type == "2"):
            print("Test2")
            response = BytesIO()
            response.write(bytes((self.getSC1Data()),'utf-8'))
            self.wfile.write(response.getvalue())
        elif (it_type == "3"):
            response = BytesIO()
            re2 = bytes(self.getSC2Data(),'utf-8')
            response.write(re2)
            self.wfile.write(response.getvalue())
        elif (it_type == "4"):
            response = BytesIO()
            re3 = bytes(self.getSC3Data(),'utf-8')
            response.write(re3)
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
