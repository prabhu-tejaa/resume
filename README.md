# My Resume Website

This is a simple, cool-looking website that hosts my resume. When you visit the link, it gives a developer/hacker vibe by showing a blinking terminal animation, and then it automatically opens my resume PDF.

## How It Works (Behind the Scenes)

Here is exactly what the code is doing step-by-step:

1. **Finding the PDF Automatically**: Because this site is hosted on GitHub Pages, it uses a tool called Jekyll. In the `index.html` file, there is a small script that automatically searches through the project and finds the very first `.pdf` file it sees. It saves the link to this file for later.
2. **The Terminal Animation**: 
   - The `css/style.css` file gives the page a dark background and a typewriter-style font.
   - It creates a blinking block (`█`) next to the text `~ ./fetch_resume.sh` to make it look like a real command line terminal.
3. **Automatic Redirect (`app.js`)**:
   - The `js/app.js` file handles opening the resume. 
   - It tries to silently download the PDF in the background. Once it finishes loading, it automatically redirects you to the actual PDF document.
   - As a backup, if it takes more than 6 seconds to load, it will just force the browser to go to the PDF link anyway.
   - If no PDF was found in the project at all, it will show a red error message saying "Error: Resume file not found."
4. **Returning to the Page**: If you click the "Back" button on your browser after viewing the PDF, the JavaScript detects this and changes the text to `~ ./resume_fetched.sh` so it looks like the terminal command successfully finished!
5. **Google Analytics**: The `js/tracking.js` file contains a small tracker so we can see how many people visit the site.
6. **Social Media Previews**: The `index.html` has special meta tags (OpenGraph and Twitter cards) so that when the link is shared on places like Twitter, LinkedIn, or iMessage, it shows a nice preview card with a title, description, and GitHub profile picture.

## How to Put a New Resume

Whenever you want to update the resume shown on this website, just follow these simple steps:

1. **Delete the old resume**: Open the `assets` folder in this project and delete the existing resume file (for example, `Software_Engineer_CV.pdf`).
2. **Add the new resume**: Copy your new resume (it must be a `.pdf` file) into the `assets` folder. You can name it whatever you like.
3. **Commit and Push**: Save your changes and push them to GitHub. 

Because of the automatic script mentioned in step 1, the website will automatically find your new PDF and update the download link! 

*(Note: Just make sure there is only one PDF file in the `assets` folder so it doesn't accidentally pick the wrong one!)*
