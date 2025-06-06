import requests

session = requests.Session()
for i in range(5):
    session.get('https://httpbin.org/delay/1')
