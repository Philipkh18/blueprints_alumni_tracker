# Notion Setup Guide

## 1. Create a Notion Integration

1. Go to https://www.notion.so/profile/integrations
2. Click **New integration**
3. Name it "Alumni Tracker", select your workspace
4. Copy the **Internal Integration Secret** → `NOTION_TOKEN` in `.env.local`

## 2. Create Three Databases

Create these as full-page databases in Notion. The property names must match exactly.

---

### Profiles Database

| Property Name   | Type     | Notes                        |
|-----------------|----------|------------------------------|
| `Name`          | Title    | Full name (default title)    |
| `clerk_id`      | Text     | Clerk user ID                |
| `graduation_year` | Number | e.g. 2025                   |
| `major`         | Text     |                              |
| `minor`         | Text     |                              |
| `bio`           | Text     |                              |
| `phone_number`  | Phone    | Optional contact number      |
| `linkedin_url`  | URL      |                              |
| `avatar_url`    | URL      |                              |
| `banner_url`    | URL      | Profile header image         |
| `big`           | Relation | Self-relation to Profiles DB |
| `is_admin`      | Checkbox | Default: unchecked           |

Copy the database ID → `NOTION_PROFILES_DB_ID`

---

### Internships Database

| Property Name | Type              | Notes                        |
|---------------|-------------------|------------------------------|
| `Name`        | Title             | Role title                   |
| `company`     | Text              |                              |
| `Profile`     | Relation          | Points to Profiles database  |
| `start_date`  | Date              |                              |
| `end_date`    | Date              | Leave blank if current       |
| `description` | Text              |                              |
| `company_website` | URL           | Used to pull company icon    |

Copy the database ID → `NOTION_INTERNSHIPS_DB_ID`

---

### Clubs Database

| Property Name | Type     | Notes                        |
|---------------|----------|------------------------------|
| `Name`        | Title    | Club name                    |
| `Profile`     | Relation | Points to Profiles database  |
| `role`        | Text     | e.g. President               |
| `start_year`  | Number   |                              |
| `end_year`    | Number   | Leave blank if active        |

Copy the database ID → `NOTION_CLUBS_DB_ID`

---

## 3. Share Databases with Your Integration

For each of the three databases:
1. Open the database → click **...** menu (top right)
2. Click **Connections** → search for your integration → **Confirm**

## 4. Get Database IDs

Open each database in your browser. The URL looks like:
```
https://www.notion.so/your-workspace/DATABASE_ID?v=...
```
The DATABASE_ID is the 32-character string before the `?`. Copy it into `.env.local`.
