# Contributing to Quantum

This guide covers ways in which you can become a part of the ongoing development of Quantum. Outlined in this file are:
* Reporting an Issue
* Contributing to the Quantum code


## Code of Conduct

Quantum is committed to fostering a welcoming, collaborative and passionate community. If you encounter any unacceptable behavior, follow these steps to report the issue to the Quantum team. We are here to help. Our standards is to use welcoming and inclusive language, being respectful of differing viewpoints, accepting constructive criticism, showing empathy towards other community members, and focusing on what is best for the community. As contributors and maintainers of the Quantum, we pledge to respect everyone who contributes by posting issues, updating documentation, submitting pull requests, providing feedback in comments, and any other activities.

Communication through any of Quantum's channels (GitHub, IRC, mailing lists, Google+, Twitter, etc.) must be constructive and never resort to personal attacks, trolling, public or private harassment, insults, or other unprofessional conduct. We promise to extend courtesy and respect to everyone involved in this project regardless of gender, gender identity, sexual orientation, disability, age, race, ethnicity, religion, or level of experience. We expect anyone contributing to Quantum to do the same. If any member of the community violates this code of conduct, the maintainers of Quantum may take action, removing issues, comments, and PRs or blocking accounts as deemed appropriate.

If you are subject to or witness unacceptable behavior, or have any other concerns, please email us at quantum@audacy.space.


## Reporting an Issue
Quantum uses GitHub Issue Tracking to track issues (primarily bugs and contributions of new code). 
If you found a bug,
* Ensure that the bug was not previously reported by searching on Github under [Issues](https://github.com/audacy/quantum/issues).
* If you are unable to find an existing open issue, open a new issue. It should have a clear and descriptive title, steps to reproduce the issue, expected and actual behavior. Include code samples, screenshots wherever needed.

## Contributing to the Quantum code

### Pre-requisites

* Install Git, e.g. `yum install -y git`
* Install Docker (https://docs.docker.com/engine/installation/)
* Install MongoDB on your desktop/server (https://docs.mongodb.com/manual/administration/install-community/). 

### Style Guides
We're not super strict on style guides yet, but as Quantum grows and we increasingly automate the DevOps / QA processes, consistent coding style is increasingly important. To future proof your code, please consult the following guidelines:

* [Angular v1 Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)
* [Javascript Guide](https://google.github.io/styleguide/jsguide.html)
* [CSS+JS Guide](https://github.com/airbnb/javascript/tree/master/css-in-javascript)
* [HTML5 Guide](https://www.w3schools.com/html/html5_syntax.asp)

### Folder Structure
* /app - Application folder (Frontend)
  * /app/css - stores CSS files of the application
  * /app/fonts - stores fonts of the application
  * /app/js - AngularJS folder
  * /app/js/components - stores all AngularJS components like index pages, procedures, sections
  * /app/js/controllers - stores the main controller
  * /app/js/services - stores all AngularJS services used by componentsfor code modularity.
  * /app/media - stores logos, icons, background images used in the application
  * /app/scripts - stores JS scripts(Bootstrap, etc.)
  * /app/views - stores the HTML pages rendered with EJS
* /config - stores server-side environment configuration files
* /nginx - stores nginx configuration 
* /server - NodeJS server folder
  * /server/controllers - stores definitions of the API route controller functions
  * /server/models - stores MongoDB schema models
  * /server/routes.js - stores the API routes for the application
* /test - stores mocha unit tests for the API routes
* /testfiles - stores example procedures for Quantum.

### Clone the Repositories
Clone the Quantum github repository in a single folder, such as ~/repositories

    cd ~
    mkdir repositories
    cd repositories
    git clone https://github.com/AudacySpace/quantum.git
    
### Build and Run Docker container for Quantum
Follow steps to build and deploy the container on localhost. Shared Drives feature of Docker is used to create a developer environment, where in the changes in your code are reflected on the docker container running locally on your computer.

    cd ~/repositories/quantum
    docker build -t quantum-app .
    npm install
    docker run -d -t --name quantum --cap-add SYS_PTRACE -v /proc:/host/proc:ro -v /sys:/host/sys:ro -v $(pwd):/node/ -p 80:80 -p 443:443 quantum-app

The UI should be up and running on: https://<span></span>localhost. Click on Login to get started.

Notes:

1. $(pwd) is the present working directory which over here is the path on your local machine to quantum repository. Windows users can replace $(pwd) with the absolute path to the quantum directory. 

2. For Windows users, enable Shared Drives in Docker settings to use the above docker run command.

3. Update the environment variables in /server/config/config.env.js in the first "if" block (default values if configuration not present). For Google Authentication, create credentials following this [link](https://developers.google.com/adwords/api/docs/guides/authentication#webapp). Add credentials (client ID and client secret) with the callback URL in the config file. For database connection, it is generic(written below) currently as it assumes that user has a mongo database named "quindar" on localhost on port 27017. Update as needed for your project.

        mongodb://localhost:27017/quindar
        
    The format to be used for databaseURL is given below

        mongodb://<host IP address>:<host port>/<database name>

### Building new features/bug fixes for Quantum
1. Create your own branch

        git checkout -b <your_branch_name>

2. Write/Edit the code in your own branch.
3. Manually test the code as changes would be reflected in the browser (https://<span></span>localhost).
4. Add unit test cases by creating or updating the existing .spec.js files. Test them using command as follows:

        npm test

5. Commit the changes using a descriptive commit message.
        
        git add <filename(s)>
        git commit -m "<commit message>"

6. Update your branch, as they are likely to be changes in the base branch since you started working.

        git checkout master
        git pull --rebase
        git checkout <your_branch_name>
        git rebase master

    Check for the conflicts after rebasing with the latest changes on master.
7. Fork the Quantum repository and push your branch to remote.
8. Issue a pull request for your code changes to be merged with the Quantum repository. Refer this [link](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for the documentation.

