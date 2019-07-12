import requests
import json
from requests.auth import HTTPBasicAuth

headers = {
        'Content-type': 'application/json',
        }

doc = json.dumps({
      "DeviceID": "96768fa2-106d-4924-8c14-c9abe949b5af",
      "Actions": [
        {
          "ObisCode": "63000C0001FF",
          "Value": 1
        }
      ]
    })
url = 'https://smart-me.com:443/api/Actions'
res  = requests.post(url, headers=headers ,data=(doc),auth=HTTPBasicAuth('harish.pakala@ovgu.de', '87654321'))
print(res.text)
print("res")
