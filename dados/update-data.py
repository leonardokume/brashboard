import requests
import json
import pandas as pd

# Small script to update the infected cities
old = pd.read_csv('/home/leonardo/Python/map/git/dados/cities_ibge_codes.csv')
PARAMS = {'is_last':'True', 'place_type':'city', 'page_size':'10000'}
r = requests.get(url = 'https://brasil.io/api/dataset/covid19/caso_full/data/', params = PARAMS)
data = r.json()
data = data['results']
new = pd.read_json(json.dumps(data))
new = new.dropna()
new = new[['city', 'city_ibge_code', 'place_type', 'state']]
new = new.rename(columns={'city':'label', 'city_ibge_code':'value'})
print('Number of cities to be added: {}'.format(len(new) - len(old)))
print('Do you want to update? Y/N')
while(True):
    ans = input()
    if(ans == 'y' or ans == 'Y'):
        print('Saving file...')
        new.to_csv('./cities_ibge_codes.csv', index=False, float_format='%.0f')
    elif(ans == 'n' or ans == 'N'):
        break
    else:
        print('Please enter Y or N')
        continue
    break