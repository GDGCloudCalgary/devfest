import json
import os

def read_json(filepath):
    inp = {}
    with open(filepath) as json_data:
        inp = json.load(json_data)
    if(type(inp) == tuple):
        data_type = inp[1]
    else:
        data_type = type(inp)
    return inp, data_type

def save_json(data, filepath):
    try:
        r = json.dumps(data)
        loaded_r = json.loads(r)
        with open(filepath, 'w') as outfile:
            json.dump(loaded_r, outfile, indent=4)
        return True
    except Exception as e:
        print(e)
        return False

data, cls = read_json("../docs/default-firebase-data.json")

print(data["speakers"]['Greg_Bennett'])

ref = list(data["speakers"]['Greg_Bennett'].keys())
print(ref)

speakers, cls = read_json("speakers.json")
for speaker in speakers:
  if speaker['firstName'].lower() == "greg":
    print(speaker)
    print(speaker.keys())
    notthere = list(set(ref) - set(speaker.keys()))
    print(notthere)
    isin = set(ref).intersection(set(speaker.keys()))
    print(isin)

speaker_wall, cls = read_json("speakers_wall.json")
print(speaker_wall)

