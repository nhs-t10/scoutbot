#Scoutbot
T-10's scouting facebook chatbot. A personal assistant who understands many keywords.

##Usage
You can mention these words to activate their respective features:

`hi/hello/hey` greeting

`today` see today's meet info

`you/help` link to this page

`change/add, meet` change the meet info - **do this before every meet!**

`set/add, team` set metadata for a team (not required)

`match` input info for a team's performance within a match


##Facebook Login
set your environment variables `SCOUT_EMAIL` and `SCOUT_PASSWORD` in your bash profile. Also, create a facebook page and set `SCOUT_ID` to its id (in the about section). You must message that page.

##Google Login
Add google service account credentials json ([more info here](https://www.npmjs.com/package/google-spreadsheet#service-account-recommended-method)) in main directory as `google_creds.json`
