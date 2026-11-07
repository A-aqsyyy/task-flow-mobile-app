# TaskFlow

A simple task manager built with React Native, Expo and TypeScript.

## Features

- Five tabs: Home, Tasks, Calendar, Progress, Profile
- Add, complete, edit (long press) and delete tasks
- Assign a day to each task, with a weekly Calendar view
- Search and All / Active / Done filters
- Real progress stats and a Tasks tab badge
- Data saved on the device with AsyncStorage
- Dark mode with an Auto / Light / Dark switch
- Reset all data from the Profile tab

## Tech

- React Native + Expo (Expo Router)
- TypeScript
- React Context for shared state
- AsyncStorage for local storage

## Run it
- Email sign up, sign in and sign out with Supabase Auth
- Tasks stored in Supabase with Row Level Security, so each user only sees their own tasks
- Session stored with encrypted storage on the device

## Supabase setup

1. Create a Supabase project and a `tasks` table with Row Level Security.
2. Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_KEY=your-publishable-key
```

Never commit `.env` and never use the `service_role` key in the app.