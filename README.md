# concept-centric-view

This is an AngularJS web application that provides a concept-centric view across all BioPortal ontologies.

Created by: Misha Dorf, Attila L. Egyedia, Clement Jonquet and Marcos Martinez-Romero at the [2nd Network of BioThings Hackathon](https://github.com/Network-of-BioThings/nob-hq/wiki/2nd-Network-of-BioThings-Hackathon).

Website: [http://ccv.bioontology.org/](http://ccv.bioontology.org/)
Backend BioPortal service: [stagedata.bioontology.org/ccv?q=leukocyte](stagedata.bioontology.org/ccv?q=leukocyte)

The backend code is available at [the NCBO's GitHub repo](https://github.com/ncbo/ontologies_api/blob/staging/controllers/ccv_controller.rb)

## Requirements
* NodeJS
* npm (included in NodeJS)
* Bower
* gulp

## Getting started

Install NodeJS (using Homebrew):

`$ brew install node`

Install bower:

`$ npm install -g bower`

Install gulp:

1) Install gulp globally: `$ npm install --global gulp`

2) Install gulp in your project devDependencies: `$ npm install --save-dev gulp`

Install all the project dependencies:

`$ npm install`

## Running the web application

Go to the project's root folder and execute `$ gulp`
