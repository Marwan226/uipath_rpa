/*
  Oracle Finance - Procurement Portal
  LOGIN CREDENTIALS FILE

  Edit this file to add, remove, or change users - no need to touch the
  main portal HTML/JS. Keep this file in the SAME FOLDER as
  oracle_procurement_portal.html (it is loaded via <script src="credentials.js">).

  Format: one entry per user, comma-separated, inside the square brackets.

    { username: "LOGIN_ID", password: "PASSWORD", displayName: "Full Name Shown In App" }

  Rules:
  - username and password are what the person types on the Sign In page (case-sensitive).
  - displayName is optional - if you leave it out, the username is shown instead.
  - Don't forget the comma between entries, and don't remove the commas/quotes.
  - Save the file as plain text (.js) - do not save it as .txt or from Word.
*/

const USERS = [
  { username: "academy_user", password: "Pass@1234", displayName: "Academy User" }
];
