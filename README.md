# 🎮Steam Bundle Checker🎮

This script get all your Steam library information (games that you own) and compare it with pages that sell games bundles.

> **Note:** please double check games marked as "not own", if the games name is misspelled could be confuse the algorithm. I will continue working to make more exact the game search. 

### Supported sites

- [Humble Bundle](https://www.humblebundle.com?partner=examencritico)
- [Indie Gala](https://www.indiegala.com/?ref=s3rxus)
- [Fanatical](https://www.fanatical.com)

## 📌Prerequisites📎

- [Tampermonkey (Chrome)](https://tampermonkey.net)
- [Greasemonkey (Firefox)](http://www.greasespot.net)
- [Violent monkey (Opera)](https://addons.opera.com/sk/extensions/details/violent-monkey/)

## 🖥️Installation🖱️

**Github**

- Enter to the user script file (usually named as <code>*.user.js</code>) you want to install.
- Click on the <code>Raw</code> button, the browser extension will recognize this file as a user script.
- Install it.

That's it!

## 🔧Configuration🔧

After the script installation, you have to fill two constants with your information: 

Steam API Dev Key (<code>STEAM_API_ID</code>). You can get yours [here](https://steamcommunity.com/dev/apikey).  
SteamID64 (<code>STEAM_USER</code>). You can find it [here](https://steamid.io).

## 📷Screenshots📷

![User script on Humble Bundle](https://i.ibb.co/fXzptqB/Screenshot-5.png)

## 🐛Known limitations🐛

- The Steam API result don't provide the DLCs that the account own, so DLCs are not supported.
- If the game title is not the same as the Steam, the algorithm could fail, on this case we provide a link to the steam search page with the name provided by the page.

### ☕Buy me a coffee☕

If you want to support my scripts, consider to use my amazon [affiliate link](https://amazon.es/?tag=sergiosusa-21) or add this query string ``?tag=sergiosusa-21`` before add a product to the basket when you buy on Amazon spain.