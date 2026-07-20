# TuDeporte

## Problem Statement

The main problem TDA solves is the lack of a centralized sports platform for local Puerto Rico sports.

Right now, local sports information is spread across different sources such as social media pages, news websites, team accounts, league pages, and older posts. This makes it difficult for users to quickly find information about their favorite teams, leagues, athletes, or recent game results.

For many fans, finding a final score, schedule, stat, or update requires searching through multiple platforms. This is inefficient and can discourage users from following local sports as closely as they would like.

## Overview

TDA is a centralized local sports hub application focused on Puerto Rico sports. The app fills a gap in the local sports community because, currently, there is no major local sports app dedicated to organizing Puerto Rico sports content in one place.

Puerto Rico has a large and passionate sports fan base, especially in sports such as baseball, basketball, boxing, combat sports, and volleyball. Even though local leagues and athletes continue to grow, their digital presence is still limited compared to larger international leagues like the NBA or MLB.

The main goal of TDA is to give local sports fans a single place where they can find scores, schedules, team information, news, and updates related to Puerto Rico sports.

## Target Users
The main target audience is local sports fans in Puerto Rico.

More specifically, TDA focuses on the following groups:

### Casual Sports Fans

Casual sports fans want a simple way to check final scores, schedules, and updates without having to search across multiple websites or social media pages.

These users may not follow every game live, but they still want to stay informed about their favorite teams and leagues.

### Daily Sports Enthusiasts

Daily sports enthusiasts want quick access to scores, schedules, previous game results, and stats.

These users are more active and may follow multiple sports or teams. They may currently have trouble finding older stats or game information because local sports content is often spread across social media posts or different websites.

### People Involved in Sports

This includes athletes, coaches, team staff, reporters, photographers, editors, and content creators.

These users can benefit from the app because it can provide more visibility for athletes, teams, and local leagues. It can also help reporters, photographers, and content creators reach more fans through a centralized sports platform.



## Planned Features
These are the core features needed for the first version of the app. Without these features, the app would not provide a complete basic sports experience.

### 1. Home Feed

The home feed is the main screen users see when they open the app. It should show the most relevant sports content, such as scores, updates, news, and followed team information.

**Why it matters:**  
This is one of the most important parts of the user experience because it gives users a quick overview of what is happening.

---

### 2. Search Tab

The search tab allows users to search for sports, teams, players, leagues, and news.

**Why it matters:**  
Users need a fast way to find specific content instead of only depending on the home feed.

---

### 3. Sports Tab

The sports tab organizes the app by different sports. Users should be able to select a sport and view related leagues, teams, games, and news.

**Why it matters:**  
This gives the app structure and makes navigation easier, especially if the app covers multiple sports.

---

### 4. Team Pages

Each team should have its own page with basic information, schedules, final scores, and related updates.

**Why it matters:**  
Team pages are important because many users follow specific teams and want one place to see all team-related information.

---

### 5. Game Schedules

The app should include schedules for upcoming games.

**Why it matters:**  
Users need to know when games are happening. This is one of the most basic features expected in a sports app.

---

### 6. Final Scores

The app should show final scores for completed games.

**Why it matters:**  
Final scores are essential for users who want to quickly check game results without searching through articles or social media posts.

---

### 7. Notifications

The app should allow users to receive notifications for important updates, such as final scores, news, and team updates.

**Why it matters:**  
Notifications help users stay updated without having to constantly open the app.

---

### 8. Admin Panel / Admin Page

The admin panel should allow authorized users to update content such as scores, schedules, teams, and news.

**Why it matters:**  
Since the app depends on accurate and updated sports information, the admin panel is necessary to manage the app’s content.


## Project Goals

### Core Goal
Provide a single, centralized platform where Puerto Rico sports fans can 
access scores, schedules, team info, news, and updates replacing the 
current fragmentation across social media and multiple websites.

### Product Principles
- **Simplicity:** the app must be usable by casual fans and daily 
  enthusiasts alike, with minimal friction.
 **Verified information:** all sports data should come from official 
  or verified sources.
- **Community:** connect fans with the communities around each sport.
- **Safe environment:** zero tolerance for violence, explicit content, 
  or harassment.

### Long-Term Vision
Expand TDA beyond content aggregation into a platform that surfaces 
opportunities for athletes in 
Puerto Rico and internationally.


## Team Members
- Ernesto Soto
- Victor De Jesus

## Current Status
The team is on definition of product's goal and scope , establishing baseline requirements, basic documentation and organization before start developing. Also we are brainstorming , sharing ideas, selecting what best fits for our limitations and doing a lot of research. 

## Future Tech Stack
The selected technology stack is:

- **Mobile:** React Native, Expo, and TypeScript
- **Backend:** NestJS
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Clerk
- **Admin Panel:** Protected web dashboard connected to the NestJS API
- **Storage:** Cloudflare R2
- **Notifications:** Expo Notifications and Firebase Cloud Messaging
- **Hosting:** Railway
- **Search:** PostgreSQL Full-Text Search
- **Possible future additions:** Redis, BullMQ, and AWS
