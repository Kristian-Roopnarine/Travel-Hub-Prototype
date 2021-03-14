import pandas as pd
COLUMNS = ['state_name','city','country','state_id','id','iso2','iso3','lat','lng']
US_CSV = 'uscities.csv'
WORLD_CSV = 'worldcities.csv'
OUTPUT_FILE='cleaned_cities.csv'

cities_df = pd.DataFrame(columns=COLUMNS)
us_cities = pd.read_csv(US_CSV)
us_cities['country'] = 'United States'
world_cities = pd.read_csv(WORLD_CSV)
world_cities = world_cities[world_cities['country'] != 'United States']
fnames = [world_cities,us_cities]
cities_df = pd.concat(fnames)
combined_df = cities_df[COLUMNS]

unique_cities_df = combined_df.drop_duplicates(subset=['id'],keep='last')
print(unique_cities_df.shape)
unique_cities_df.to_csv(OUTPUT_FILE,index=False)