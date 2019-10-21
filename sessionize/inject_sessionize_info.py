import json
import os
import requests
people_image_path = "../images/people/"

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
def save_profile_pic(path, name, url):
  with open(path + name + ".png", 'wb') as handle:
    response = requests.get(url, stream=True)
    if not response.ok:
      print(response)
    for block in response.iter_content(1024):
      if not block:
        break
      handle.write(block)

data, cls = read_json("../docs/default-firebase-data.json")
reference = data["speakers"]
save_json(data, "../docs/default-firebase-data-bkp.json")


print("Reference:")
print(reference)
print(list(reference['Greg_Bennett'].keys()))
reference_keys = list(reference['Greg_Bennett'].keys())

print("socials:", reference['Greg_Bennett']['socials'])

speakers, cls = read_json("speakers.json")
speaker_wall, cls = read_json("speakers_wall.json")
print("From Sessionize:")
print(speakers[0].keys())
print(speaker_wall[0].keys())



def insert_speaker(speakers, speaker_wall):
  speakers_reference = {}
  order = 1
  for speaker in speakers:
    print(speaker['links'])
    print(speaker["questionAnswers"])
    for sw in speaker_wall:
      if sw["id"] == speaker["id"]:
        speaker["tagLine"] = sw["tagLine"]
        speaker["isTopSpeaker"] = sw['isTopSpeaker']

    name_key = speaker["firstName"] + "_" + speaker["lastName"]
    reference_speaker_info = {}
    reference_speaker_info["name"] = speaker["fullName"]
    reference_speaker_info["bio"] = speaker["bio"]
    reference_speaker_info["shortBio"] = speaker['tagLine']
    reference_speaker_info["title"] = speaker['tagLine']
    reference_speaker_info["order"] = str(order)
    order = order + 1
    picUrl = speaker['profilePicture']
    picname = speaker["firstName"].lower() + "." + speaker["lastName"].lower()
    save_profile_pic(people_image_path,picname,picUrl)
    reference_speaker_info["photo"] = '/images/people/' + picname + '.png'
    reference_speaker_info["photoUrl"] = 'https://www.devfestyyc.com/images/people/' + picname + '.png'
    reference_speaker_info['featured'] = speaker['isTopSpeaker']
    reference_speaker_info['socials']=[]

    if len(speaker['links'])>0:
      for ln in speaker['links']:
        if ln['title'].lower() == "linkedin":
          ref_social = {'icon': 'linkedin', 'link': '', 'name': 'LinkedIn'}
          ref_social['link'] = ln['url']
        elif ln['title'].lower() == "twitter":
          ref_social = {'icon': 'twitter', 'link': '', 'name': 'Twitter'}
          ref_social['link'] = ln['url']
        elif ln['title'].lower() == "github":
          ref_social = {'icon': 'github', 'link': '', 'name': 'Github'}
          ref_social['link'] = ln['url']
        else:
          ref_social = {}
        reference_speaker_info['socials'].append(ref_social)
    qa = speaker["questionAnswers"]
    if len(qa) > 0:
      for q in qa:
        if q['question'] == '1. Current Organization/ Company Name':
          if str(q['answer']).lower() != "none":
            reference_speaker_info['company'] = q['answer']
          else:
            reference_speaker_info['company'] = ''
    speakers_reference[name_key] = reference_speaker_info
  return speakers_reference



data["speakers"] = insert_speaker(speakers, speaker_wall)
print(data["speakers"] )
save_json(data, "../docs/default-firebase-data.json")
