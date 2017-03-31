# Guardian Assistant

## Introduction

A task from Shanbay.

## Tasks

> Assuming that there is a
[Target Page](http://www.theguardian.com/politics/2015/may/28/david-cameron-sets-off-on-mission-to-win-over-european-leaders), we expect you to develop a Chrome extension, which can implement following features:
> 1. Filter out the ads and useless content of this page. Accurately, just keep the heading, figures and the body of the news.
> 2. Pagination. Ample test for various screens size and resolutions.
> 3. Popup the translation of the word when click. Translations are expected to be generated from Shanbay's API.


## Usage

1. ` git clone https://github.com/JasonSi/guardian_assistant.git`
2. `cd guardian_assistant`
7. `npm i`
4. `gulp`
5. Visit <chrome://extensions/> and ensure the "Developer mode" checked, click "Load unpacked extension… " to import your extension folder.
6. Visit the [Target Page](http://www.theguardian.com/politics/2015/may/28/david-cameron-sets-off-on-mission-to-win-over-european-leaders) to test the extension.
