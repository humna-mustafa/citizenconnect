# CitizenConnect Database Seeding Guide

This project includes SQL scripts to populate the Supabase database with over 150 guides across various categories.

## Prerequisites

- Access to the Supabase Dashboard for your project.
- The `categories` and `guides` tables must exist (created via migrations).

## Seeding Instructions

To populate the database, run the following SQL scripts in the Supabase SQL Editor in order:

### Step 1: Seed Roads & Water Categories
Run the content of `scripts/seed-guides.sql`.
- Adds "Roads & Transport" and "Sewerage & Water" categories.
- Adds 43 guides.

### Step 2: Seed Remaining Categories
Run the content of `scripts/seed-guides-remaining.sql`.
- Adds "Electricity & Gas", "Health", "Education", "Social Causes", "Legal", and "Government Services" categories.
- Adds 100+ additional guides.

## How to Run

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** tab.
3. Click **New Query**.
4. Copy the content of the SQL file.
5. Paste it into the editor and click **Run**.

## Troubleshooting

- If you see "relation does not exist" errors, ensure your migrations have run.
- If you see "duplicate key" errors, the scripts are designed to handle conflicts (`ON CONFLICT DO NOTHING` or `DO UPDATE`), so it should be safe to re-run.
