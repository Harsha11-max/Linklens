
# LinkLens - Smart URL Shortener & Analytics Dashboard

## About the Project

LinkLens is a web-based URL shortening application
built using HTML, CSS, JavaScript, Node.js, and Express.js.

It allows users to convert long URLs into shorter links
and monitor their performance through an analytics dashboard.

## Features

- Generate unique shortened URLs
- Redirect short links to original websites
- Track the number of clicks
- View total links and total clicks
- Display shortened URL history
- Refresh analytics statistics
- Save URLs and clicks using JSON file storage
- Responsive and modern dashboard

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Storage
- JSON File Storage

### Version Control
- GitHub

## Installation and Setup

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Open the terminal.
4. Install dependencies:

   npm install

5. Start the server:

   node server.js

6. Open your browser and visit:

   http://localhost:3000

## How LinkLens Works

1. Enter a long website URL.
2. Click the Shorten URL button.
3. LinkLens generates a unique short code.
4. The shortened URL is displayed.
5. Opening the short URL redirects to the original site.
6. Each visit increases its click count.
7. The Analytics Dashboard displays the statistics.

## Data Storage

The application uses a local links.json file.

This file stores the original URLs, short codes,
and number of clicks.

The data remains available after server restarts.

## Current Limitations

- Short URLs work locally using localhost.
- The Node.js server must be running.
- Public hosting is not yet configured.

## Future Enhancements

- User authentication
- QR code generation
- Custom short URLs
- Advanced analytics charts
- Database integration
- Cloud deployment

## Project Status

Functional local prototype.

## Conclusion

LinkLens demonstrates full-stack web development,
REST APIs, URL redirection, click tracking,
and persistent local data storage.
