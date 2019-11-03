import json
import os
import requests
import datetime
import numpy as np

months = {}
months["1"] = "January"
months["2"] = "February"
months["3"] = "March"
months["4"] = "April"
months["5"] = "May"
months["6"] = "June"
months["7"] = "July"
months["8"] = "August"
months["9"] = "September"
months["10"] = "October"
months["11"] = "November"
months["12"] = "December"

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
def get_sessionize_json(url):
  response = requests.get(url)
  if not response.ok:
    print(response)
  body = response.json()
  return body

people_image_path = "../images/people/"
logos_image_path = "../images/logos/"
sessionize_speakers_url = "https://sessionize.com/api/v2/lo4pjfv9/view/Speakers"
sessionize_speakers_wall_url  = "https://sessionize.com/api/v2/lo4pjfv9/view/SpeakerWall"
sessions_url  = "https://sessionize.com/api/v2/lo4pjfv9/view/Sessions"
schedule_table_url  = "https://sessionize.com/api/v2/lo4pjfv9/view/GridTable"
schedule_smart_grid_url  = "https://sessionize.com/api/v2/lo4pjfv9/view/GridSmart"

speakers = get_sessionize_json(sessionize_speakers_url)
save_json(speakers, "speakers.json")
speakers_wall = get_sessionize_json(sessionize_speakers_wall_url)
save_json(speakers_wall, "speakers_wall.json")
sessions = get_sessionize_json(sessions_url)
save_json(sessions, "sessions.json")
schedule_table = get_sessionize_json(schedule_table_url)
save_json(schedule_table, "schedule_table.json")
schedule_smartgrid = get_sessionize_json(schedule_smart_grid_url)
save_json(schedule_smartgrid, "schedule_smartgrid.json")
data, cls = read_json("../docs/default-firebase-data.json")
save_json(data, "../docs/default-firebase-data-bkp.json")
print(data.keys())

schedule_details, cls = read_json("schedule_table.json")
sessions_details, cls = read_json("sessions.json")
speakers, cls = read_json("speakers.json")
speaker_wall, cls = read_json("speakers_wall.json")

def get_date_time(dtime):
  ymd = dtime.split("T")
  tt = ymd[1]
  ymd = ymd[0]
  ymd1 = ymd.split("-")
  ymd1 = months[ymd1[1]] + " " + ymd1[2] + " " + ymd1[0]
  return ymd, ymd1, tt

id_list = []
##################################################################### Sessions ###########################################################################
def session_builder(sessions_details):
    all_session_info = {}
    session_slots = {}
    tracks = {}
    rooms = {}
    for ses in sessions_details:
      sess_det = ses['sessions']
      for det in sess_det:
        new_ses = {}
        id = det["id"]
        session_slots[id] = {"startTime": det['startsAt'], "endTime": det['endsAt']}
        new_ses["description"] = det["description"]
        new_ses["title"] = det["title"]

        new_ses["speakers"] = []
        for speak in det["speakers"]:
          new_ses["speakers"].append("_".join(speak['name'].split()))
        new_ses["icon"] = ''
        new_ses["videoID"] = ''
        new_ses["image"] = ''
        new_ses["presentation"] = ''
        new_ses["roomId"] = det["roomId"]
        new_ses["room"] = det["room"]
        rooms[det["roomId"]] = det["room"]

        for cat in det["categories"]:
          if cat["name"].lower() == "language":
            language = ""
            for lan in cat['categoryItems']:
              language += lan["name"] + ","
            language = list(language)[0:len(language)-1]
            new_ses["language"] = "".join(language)

          if cat["name"].lower() == "level":
            level = ""
            for lev in cat['categoryItems']:
              level += lev["name"] + ","
            level = list(level)[0:len(level) - 1]
            new_ses["complexity"] = "".join(level)

          if cat["name"].lower() == "track":
            track = ""
            for trk in cat['categoryItems']:
              track += trk["name"] + ","
            track = list(track)[0:len(track) - 1]
            trac = "".join(track)
            new_ses["tags"] = [trac]
            #new_ses["track"] = "".join(track)
            dat0, dat1, dat2 =  get_date_time(det['startsAt'])
            if dat0 not in tracks.keys():
              tracks[dat0] = {}
            if trac not in tracks[dat0].keys():
              tracks[dat0][trac] = {}
            if det["roomId"] not in tracks[dat0][trac].keys():
              tracks[dat0][trac][det["roomId"]] = det["room"]
          if cat["name"].lower() == "session format":
            track = ""
            for trk in cat['categoryItems']:
              track += trk["name"] + ","
            track = list(track)[0:len(track) - 1]
            #new_ses["session_format"] = "".join(track)
        id = int(id)
        id_list.append(id)
        all_session_info[id] = new_ses
    return all_session_info, session_slots, tracks, rooms

session_det, session_slots, session_tracks, rooms  =  session_builder(sessions_details)


##################################################################### Schedule ###########################################################################
print("schedule")
sch_ref = data["schedule"]['2019-11-22']
print(sch_ref.keys())
print("schedule details")

start = 100
id_dict = {}
schedule = {}
timeslots = {}
for slotid, det in session_slots.items():
  date, read, tt = get_date_time(det["startTime"])
  if date not in timeslots.keys():
    timeslots[date] = {}
  tm = tt.split(":")
  tm = tm[0] + "." + tm[1]
  if tm not in timeslots[date]:
    timeslots[date][tm] = {}
  date, read, tt = get_date_time(det["endTime"])
  tm1 = tt.split(":")
  tm1 = tm1[0] + "." + tm1[1]
  if tm1 not in timeslots[date][tm]:
    timeslots[date][tm][tm1] = []
  timeslots[date][tm][tm1].append(slotid)

for sc in schedule_details:
  date, read, tt = get_date_time(sc["date"])
  schedule[date]= {}
  schedule[date]['dateReadable'] = read

  for s_rm in sc["rooms"]:
    for s_tm in s_rm["sessions"]:
        d_st_tm, r_st_tm, tt_st_tm = get_date_time(s_tm['startsAt'])
        d_ed_tm, r_ed_tm, tt_ed_tm = get_date_time(s_tm['endsAt'])
        tm = tt_st_tm.split(":")
        tm = tm[0] + "." + tm[1]
        if tm not in timeslots[date]:
          timeslots[date][tm] = {}
        tm1 = tt_ed_tm.split(":")
        tm1 = tm1[0] + "." + tm1[1]
        if tm1 not in timeslots[date][tm]:
          timeslots[date][tm][tm1] = []
        timeslots[date][tm][tm1].append(s_tm["id"])
        try:
          id = int(s_tm["id"])
        except:
          if s_tm["id"] not in session_det.keys():
            new_ses = {}
            new_ses["description"] = s_tm["description"]
            new_ses["title"] = s_tm["title"]
            new_ses["speakers"] = []
            for speak in s_tm["speakers"]:
              new_ses["speakers"].append("_".join(speak['name'].split()))
            new_ses["icon"] = ''
            new_ses["videoID"] = ''
            new_ses["image"] = ''
            new_ses["presentation"] = ''
            new_ses["roomId"] = s_tm["roomId"]
            new_ses["room"] = s_tm["room"]
            if s_tm["roomId"] not in rooms.keys():
              rooms[s_tm["roomId"]] = s_tm["room"]
            new_ses["tags"] = ["Google Programs & Non-Technical"]
            session_det[start] = new_ses
            id_dict[s_tm["id"]] = start
            start = start + 100
  schedule[date]['timeslots'] = []
  schedule[date]['tracks'] = []


for date in schedule.keys():
  slots_tms = timeslots[date]
  tmslots = []
  for st in slots_tms.keys():
    for et, ids in slots_tms[st].items():
      ids = list(set(ids))
      print(ids)
      tmp = {}
      tmp["endTime"] = et
      tmp["sessions"] = []
      tmp["startTime"] = st
      for id in ids:
        tmp1 = {}
        tmp1["endTime"] = et
        tmp1["sessions"] = []
        tmp1["startTime"] = st
        try:
          id = int(id)
          if id in id_list:
            item = {'items': [id]}
            tmp1["sessions"].append(item)
            tmslots.append(tmp1)
        except:
          if id in id_dict:
            id = id_dict[id]
            if id not in id_list:
              id_list.append(id)
              item = {'items': [id]}
              tmp["sessions"].append(item)
      if len(tmp["sessions"]) > 0:
        tmslots.append(tmp)

  tmslots_times = [float(x["startTime"]) for x in tmslots]
  indxs = np.argsort(tmslots_times)
  slots = []
  for i in indxs:
    slots.append(tmslots[i])
  schedule[date]['timeslots'] = slots
  sessinf = session_tracks[date]
  sesstrack = []
  for track, roo_det in sessinf.items():
    tmp = {}
    tmp["title"] = track
    tmp["roomId"] = []
    tmp["room_name"] = []
    for roomid, nm in roo_det.items():
      tmp["roomId"].append(roomid)
      tmp["room_name"].append(nm)
    sesstrack.append(tmp)
  schedule[date]["tracks"] = sesstrack

data["schedule"] = schedule
data["sessions"] = session_det
data["rooms"] = rooms
##################################################################### SPEAKERS ###########################################################################

def insert_speaker(speakers, speaker_wall):
  speakers_reference = {}
  speaker_company_logos = {}
  order = 1
  for speaker in speakers:
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

    speaker_company_logos[name_key] = {}

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
    speaker_company_logos[name_key]["company"] =  reference_speaker_info['company']
    speaker_company_logos[name_key]["companyLogo"] = "https://storage.googleapis.com/dfua17.appspot.com/images/logos/"
    speakers_reference[name_key] = reference_speaker_info
  return speakers_reference, speaker_company_logos

def overwrite_companyinfo(speaker_det, download_images=False):
  if os.path.exists("../docs/speaker_company_details.json"):
    dets, cls = read_json("../docs/speaker_company_details.json")
    for speaker, details in dets.items():
      if speaker in speaker_det.keys():
        speaker_det[speaker]["company"] = details["company"]

        logourl = details["companyLogo"]
        if download_images == False:
          imagename = logourl.split("/")[-1]
        else:
          imagename = logourl.split("/")[-1]
          save_profile_pic(logos_image_path, imagename, logourl)

        logourl = '/images/logos/' + imagename
        speaker_det[speaker]["companyLogo"] = logourl
        speaker_det[speaker]["companyLogoUrl"] = 'https://www.devfestyyc.com' + logourl
    return speaker_det


speaker_det, comp_det = insert_speaker(speakers, speaker_wall)
speaker_det = overwrite_companyinfo(speaker_det, download_images=False)
data["speakers"] = speaker_det


def overwrite_partners(data):
  if os.path.exists("../docs/partners.json"):
    dets, cls = read_json("../docs/partners.json")
    data["partners"] = dets["partners"]
  return data

data = overwrite_partners(data)
################################################################################# SAVE NEW FILE ###########################################################################################3
save_json(data, "../docs/default-firebase-data.json")
save_json(comp_det, "../docs/speaker_company_details_tmp.json")
