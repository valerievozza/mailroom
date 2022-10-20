
# Mailroom

Mailroom is an application to manage mail service for hundreds of clients by securely storing client data and accurately tracking mailbox activity. Mailroom was developed for shelters or other non-profit organizations providing a mailing address for people who are unhoused or otherwise do not have access to a safe place to consistently receive mail

**Link to project:** https://mailroom.cyclic.app

## Screenshots

![Mailroom screenshot](https://user-images.githubusercontent.com/101529105/190074645-af766088-cf3d-4498-a887-2f661b650239.png)
||||
|:---:|:---:|:---:|
| ![Screenshot_20221011-144943](https://user-images.githubusercontent.com/101529105/195205553-1d942ec0-d279-451a-a097-ce53c591e74b.png) | ![Screenshot_20221011-145013](https://user-images.githubusercontent.com/101529105/195205555-c3291027-d111-45fd-aff5-eb47925fe6b4.png) | ![Screenshot_20221011-145034](https://user-images.githubusercontent.com/101529105/195205556-4d9b98c1-4857-4fa7-99f9-f0a897e41f13.png) |
| ![Screenshot_20221020-162748](https://user-images.githubusercontent.com/101529105/197078397-faed9037-5442-46b3-8bab-59392c75e1d8.png) | ![Screenshot_20221020-162741](https://user-images.githubusercontent.com/101529105/197078400-9a4e8884-1705-4b53-97d4-3886226104cf.png) | ![Screenshot_20221020-162759](https://user-images.githubusercontent.com/101529105/197078402-29f9bea9-7200-4e9b-a0ce-c8c7fcb0fd20.png) |

## Tech Stack

**Client:** Handlebars, CSS, Bootstrap, Bootswatch

**Server:** JavaScript, Node, Express, MongoDB

**Dependencies:** bcrypt, bootstrap-icons, cloudinary, connect-mongo, cross-env, dotenv, express, express-flash, express-handlebars, express-session, googleapis method-override, moment, mongoose, mongoose-unique-validator, morgan, multer, nodemailer, nodemon, passport, passport-local, validator

## Features

- Secure login with Passport Auth
- Add, update, & delete client records
- Upload relevant documents to client records
- Open & close mailboxes
- Log mailbox checks

## Installation

Install with npm

```bash
  npm install bcrypt bootstrap-icons cloudinary connect-mongo cross-env dotenv express express-flash express-handlebars express-session googleapis method-override moment mongoose mongoose-unique-validator morgan multer nodemailer nodemon passport passport-local validator
```
## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`PORT = <port>` (can be any port, ex: 3000)

### Database

`DB_STRING = <your MongoDB uri>`

### Cloudinary

`CLOUD_NAME = <your cloud name>`

`API_KEY = <your Cloudinary API key>`

`API_SECRET = <your Cloudinary secret>`

### Nodemailer & Google OAuth2

`CLIENT_ID = <your Google client ID>`

`CLIENT_SECRET = <your Google client secret>`

`REFRESH_TOKEN = <your Google auth refresh token>`

`EMAIL = <GMail address>`

## Optimizations

- Added functionality to upload & store relevant documents in client file
- Added custom logic to automatically generate & validate a mailbox when adding a client record based on the last name of the client
- Organizations can have multiple user logins so multiple staff members can access client database
- Users can send customizable reminder emails to clients with inactive mailboxes with one click

**Planned Features & Improvements:**

- Integrate with Google Sheets for read/write capability
- Add chronjob for automated email reminders

## Other Examples of My Work

### Pocket:
https://pocket.cyclic.app

![pocket](https://user-images.githubusercontent.com/101529105/195203986-95c3d4ef-54b7-40cf-bde7-a8708bb7f53a.png)

### Pictogram
https://pictogram.cyclic.app

![pictogram](https://user-images.githubusercontent.com/101529105/195203985-938d761f-2c6a-4bc7-9b08-1b32cc28b610.png)

### myPetPal
https://mypetpal.onrender.com

![myPetPal](https://user-images.githubusercontent.com/101529105/195203978-398ed8da-ccda-4c21-81c0-5975f135af93.png)
