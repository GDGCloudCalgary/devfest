# Content State

The website has a snapshot listener to firestore reference `/config/site/States/current` which gets automatically transitioned on the specified dates. The state can be updated in the database to change the content of the website.

The state is a JSON object with the following structure, the `current` document can be updated manually to change the content of the website immediately, other documents can be created to schedule future changes:

```js
{
    // The date of the state change in the format MM-DD
    "date": "04-28",
    "location": {
        // The name of the location to display on the website in the header
        "name": "Calgary Central Library + PLATFORM Innovation Center",
        // The city and province of the location to display on the website in the header
        "short": "Calgary, AB"
    },
    // The date range to display on the website in the header
    "dates": "November 15-16, 2024",
    "ticketsBlock": {
        // The description of the tickets block to display on the website
        "description": "Early Bird Tickets go on sale Saturday August 31, 2024. Don't miss out! Sign up to get notifications when Early Bird Tickets go on sale!.",
        // The call to action button text of the tickets block to display on the website
        "callToAction": "Subscribe"
    },
    "homePage": {
        // The title of the home page to display on the website
        "title": "JOIN US AT NORTH AMERICA'S RADDEST DEVELOPER FESTIVAL.",
        // The description of the home page to display on the website
        "description": "ᐳᐅ!DEVFESTYYC 2024 Call for Speakers and Exhibitors is now open!",
        // The call to action button text of the home page to display on the website
        "callToAction": "SPEAK AT ᐳᐅ!DEVFESTYYC!",
        // The limited deal to display on the website
        "limitedDeal": "Super Early Bird Tickets on sale till September 30th, while supplies last."
    }
}
```
