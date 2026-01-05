import { sql } from '@vercel/postgres'

export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create weeks table
    await sql`
      CREATE TABLE IF NOT EXISTS weeks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        week_number INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, week_number)
      )
    `

    // Create tally_entries table
    await sql`
      CREATE TABLE IF NOT EXISTS tally_entries (
        id SERIAL PRIMARY KEY,
        week_id INTEGER REFERENCES weeks(id) ON DELETE CASCADE,
        day VARCHAR(20) NOT NULL,
        text_new_recruits INTEGER DEFAULT 0,
        calls_to_recruits INTEGER DEFAULT 0,
        text_interviews INTEGER DEFAULT 0,
        insta_dms INTEGER DEFAULT 0,
        initial_interviews INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(week_id, day)
      )
    `

    // Insert default users if they don't exist
    const existingUsers = await sql`SELECT username FROM users WHERE username IN ('susan', 'amelia')`

    if (existingUsers.rows.length === 0) {
      // Insert Susan (admin)
      await sql`
        INSERT INTO users (username, name, email, password_hash, role)
        VALUES ('susan', 'Susan Trombetti', 'susan@company.com', 'admin123', 'admin')
        ON CONFLICT (username) DO NOTHING
      `

      // Insert Amelia (employee)
      await sql`
        INSERT INTO users (username, name, email, password_hash, role)
        VALUES ('amelia', 'Amelia Mauriello', 'amelia@company.com', 'employee123', 'employee')
        ON CONFLICT (username) DO NOTHING
      `
    }

    console.log('Database initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export async function getUserByUsername(username: string) {
  const result = await sql`
    SELECT id, username, name, email, role, password_hash
    FROM users
    WHERE username = ${username}
  `
  return result.rows[0] || null
}

export async function getWeeksForUser(userId: number) {
  const result = await sql`
    SELECT w.id, w.week_number, w.start_date, w.end_date,
           json_agg(
             json_build_object(
               'id', e.id,
               'day', e.day,
               'textNewRecruits', e.text_new_recruits,
               'callsToRecruits', e.calls_to_recruits,
               'textInterviews', e.text_interviews,
               'instaDMs', e.insta_dms,
               'initialInterviews', e.initial_interviews
             ) ORDER BY
               CASE e.day
                 WHEN 'Monday' THEN 1
                 WHEN 'Tuesday' THEN 2
                 WHEN 'Wednesday' THEN 3
                 WHEN 'Thursday' THEN 4
                 WHEN 'Friday' THEN 5
                 WHEN 'Saturday' THEN 6
                 WHEN 'Sunday' THEN 7
               END
           ) as entries
    FROM weeks w
    LEFT JOIN tally_entries e ON e.week_id = w.id
    WHERE w.user_id = ${userId}
    GROUP BY w.id, w.week_number, w.start_date, w.end_date
    ORDER BY w.week_number
  `
  return result.rows
}

export async function createWeekForUser(userId: number, weekNumber: number, startDate: string, endDate: string) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Create the week
  const weekResult = await sql`
    INSERT INTO weeks (user_id, week_number, start_date, end_date)
    VALUES (${userId}, ${weekNumber}, ${startDate}, ${endDate})
    RETURNING id
  `

  const weekId = weekResult.rows[0].id

  // Create entries for each day
  for (const day of DAYS) {
    await sql`
      INSERT INTO tally_entries (week_id, day)
      VALUES (${weekId}, ${day})
    `
  }

  return weekId
}

export async function updateTallyEntry(
  entryId: number,
  field: string,
  value: number
) {
  const fieldMap: Record<string, string> = {
    textNewRecruits: 'text_new_recruits',
    callsToRecruits: 'calls_to_recruits',
    textInterviews: 'text_interviews',
    instaDMs: 'insta_dms',
    initialInterviews: 'initial_interviews',
  }

  const dbField = fieldMap[field]
  if (!dbField) {
    throw new Error(`Invalid field: ${field}`)
  }

  // Using dynamic field name safely
  await sql.query(
    `UPDATE tally_entries SET ${dbField} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [value, entryId]
  )

  return { success: true }
}

export async function getUserById(userId: number) {
  const result = await sql`
    SELECT id, username, name, email, role
    FROM users
    WHERE id = ${userId}
  `
  return result.rows[0] || null
}

export async function updateUserEmail(userId: number, email: string) {
  await sql`
    UPDATE users
    SET email = ${email}
    WHERE id = ${userId}
  `
  return { success: true }
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  await sql`
    UPDATE users
    SET password_hash = ${passwordHash}
    WHERE id = ${userId}
  `
  return { success: true }
}
