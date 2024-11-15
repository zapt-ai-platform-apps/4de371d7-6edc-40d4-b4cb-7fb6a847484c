# Name My Pet

Name My Pet is a web application that helps you generate unique names for your pet based on your pet's description and gender. You can save your favorite names to your personal list for future reference.

## Features

- **User Authentication**: Sign in with ZAPT using your Google, Facebook, or Apple account.
- **Pet Description Input**: Describe your pet to receive personalized name suggestions.
- **Select Pet Gender**: Choose the gender of your pet to get gender-appropriate name suggestions.
- **AI-Generated Name Suggestions**: Receive a list of unique pet names generated using AI.
- **Save Preferred Names**: Save your favorite names along with the pet's gender to your personal list.
- **View Saved Names**: Access and view all the names you've saved along with their associated gender.

## User Journey

1. **Sign In**
   - Open the app and click on "Sign in with ZAPT".
   - You will be redirected to a login page where you can sign in using Google, Facebook, or Apple.
   - Upon successful login, you will be taken to the main page of the app.

2. **Describe Your Pet**
   - On the main page, you will find a text area labeled "Describe Your Pet".
   - Enter a detailed description of your pet (e.g., "a playful golden retriever puppy with a love for water").

3. **Select Pet Gender**
   - Below the description, select the gender of your pet by choosing one of the options: Male, Female, or Other.

4. **Generate Name Suggestions**
   - Click on the "Generate Names" button.
   - The app will process your pet description and selected gender to generate a list of 10 unique pet names.
   - The generated names will be displayed under "Suggested Names".

5. **Save Favorite Names**
   - Browse through the list of suggested names.
   - Click the "Save" button next to any name you like.
   - The name, along with the selected gender, will be added to your "My Saved Names" list.

6. **View Saved Names**
   - Scroll down to the "My Saved Names" section to view all the names you've saved along with their associated gender.
   - Your saved names are stored securely and will be available the next time you log in.

7. **Sign Out**
   - When you're finished, click the "Sign Out" button at the top of the page to log out of your account.

## External Services Used

- **ZAPT**: Used for user authentication and managing secure sessions.
- **Supabase**: Used for authentication services, allowing users to sign in with social providers.
- **OpenAI's ChatGPT API**: Utilized via the `createEvent` function to generate pet name suggestions based on the pet description and gender provided.

## Notes

- The app is responsive and works well on all screen sizes.
- All interactions are seamless, with appropriate loading states displayed during processing.
- The user interface is designed to be intuitive and user-friendly.
- The app visually indicates the gender associated with each saved name.

## How It Works

- **Authentication**: Users authenticate through Supabase, which handles social logins and session management.
- **Name Generation**: When the user submits a pet description and selects a gender, the app sends a request to the backend using the `createEvent` function with event type `chatgpt_request`. The AI generates gender-appropriate name suggestions and returns them in JSON format.
- **Saving Names**: Saved names, along with the pet's gender, are stored in a PostgreSQL database managed through Drizzle ORM. Users can view their saved names anytime by logging into the app.