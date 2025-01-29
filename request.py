import requests

text = 'I am sad'
# url = "http://127.0.0.1:8000/tokenize"  
url = f"http://127.0.0.1:8000/sentiment/?text={text}"  

response = requests.get(url)


if response.status_code == 200:
    data = response.json()
    # print('data',data) 
else:
    print(f"Failed to fetch data. Status code: {response.status_code}")
