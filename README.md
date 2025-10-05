# Secure Vault - Password Manager (MVP)

Secure Vault is a web application that allows users to generate strong, unique passwords and save them in a personal, encrypted vault. This project emphasizes privacy-first principles by performing all encryption and decryption on the client-side, ensuring the server never has access to plaintext secrets.

---
How to use:(how to run)

## Step 1: Create Your Account (Sign Up)
This is the first thing you'll do to get started.

Navigate to the home page of the application.

Click the Sign Up button.

Enter your email address and create a strong Master Password.

Click "Create Account".

Important: Your Master Password is the key to your entire vault. 🔑 Due to the zero-knowledge design, if you forget this password, your encrypted data cannot be recovered.


## Step 2: Log In to Your Vault
Once your account is created, you can log in.

Go to the Login page.

Enter the email and Master Password you just created.

Click Login. You will be taken to your dashboard.

If you have Two-Factor Authentication (2FA) enabled, you will be asked to enter a 6-digit code from your authenticator app after entering your password.


## Step 3: Generate and Save a New Password
This is the main workflow of the application.

On the dashboard, find the Password Generator card on the left.

Adjust the settings (length, symbols, etc.) to your preference. A new password will be generated automatically.

Click the Copy button next to the generated password.

On the right side of the dashboard, click the "+ Add Item" button.

A modal window will pop up. Fill in the details for the new entry (e.g., Title: "Google", Username: "my-email@gmail.com").

Paste the password you copied into the "Password" field.

Click Save Item. Your new credential is now securely stored in your vault!


## Step 4: Manage Your Saved Items
Once you have items in your vault, you can manage them easily.

Search: Simply type in the search bar at the top of your vault list. The list will filter in real-time.

View a Password: Click the eye icon (👁️) within an item to temporarily reveal the password.

Copy a Password: Click the copy icon next to a password to copy it to your clipboard.

Edit an Item: Click the Edit icon on any vault item. The modal will appear with the item's details, allowing you to make changes.


Delete an Item: Click the Delete (trash) icon and confirm your choice to permanently remove an item.


## Step 5: Enhance Your Security (Optional)
You can add an extra layer of protection to your account.

In the navbar at the top, click Settings.

Click the Enable 2FA button.

Scan the QR code that appears with an authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator).

Enter the 6-digit code from the app to verify and complete the setup.

## Step 6: Back Up and Restore Your Vault (Optional)
You can export an encrypted backup of your vault for safekeeping.

To Export: On the dashboard, find the "Manage Vault" card and click Export Encrypted Vault. A secure .json file will be downloaded to your computer.

To Import: Click Import Encrypted Vault, select the .json file you previously exported, and the items will be added back to your vault.


Note:: what you used for crypto and why?

For client-side encryption, I used AES-256, a robust and industry-standard symmetric encryption algorithm. The encryption key is derived from the user's master password using PBKDF2, which adds protection against brute-force attacks. This zero-knowledge approach ensures maximum privacy, as all sensitive vault data is encrypted on the client before ever being transmitted to the server.

---


### Features

* **Strong Password Generator**: Customizable options for length, numbers, and symbols, including the ability to exclude look-alike characters.
* **Encrypted Vault**: Securely store credentials (title, username, password, URL, notes) using client-side AES-256 encryption.
* **Zero-Knowledge Architecture**: The server only ever stores encrypted blobs of data, guaranteeing user privacy.
* **Full CRUD Functionality**: Add, view, edit, and delete vault items seamlessly.
* **User Authentication**: Secure user registration and login system.
* **Two-Factor Authentication (2FA)**: Support for TOTP-based 2FA for an extra layer of security.
* **Dark Mode**: A sleek, user-friendly dark theme.
* **Encrypted Export/Import**: Users can back up and restore their entire vault with an encrypted JSON file.

---

### Tech Stack

* **Frontend**: Next.js with React & TypeScript
* **Backend**: Next.js API Routes
* **Database**: MongoDB (via Mongoose)
* **Styling**: Tailwind CSS
* **Authentication**: JWT (JSON Web Tokens) & bcrypt.js
* **Encryption**: crypto-js

---

### Getting Started: How to Run Locally

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
* Node.js (v18 or later)
* npm
* A free MongoDB Atlas account

**Installation & Setup:**

1.  **Clone the repo**
    ```sh
    git clone <your-github-repo-url>
    cd secure-vault
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables**
    Create a file named `.env.local` in the root of the project and add the following variables:
    ```env
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="generate_a_very_long_and_random_secret_string_here"
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
