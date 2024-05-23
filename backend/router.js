const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const cors = require('cors');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const isAuthenticated = require('./authentication')
const checkRole = require('./roleauth')
const Buffer = require('buffer').Buffer
const multer = require('multer')




dotenv.config();

const { body, validationResult, check } = require('express-validator');
const { isatty } = require('tty');
const { error } = require('console');

const createHashedPassword = async(textPass) => {
  const saltRounds = 10;
  return bcrypt.hash(textPass, saltRounds);
};

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret_key';
const base64EncodedKey = Buffer.from(SECRET_KEY).toString('base64')

app = express();

const client = new Client ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_DATABASE_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

client.connect()
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      full_name VARCHAR(255) DEFAULT NULL, -- or DEFAULT ''
      date_of_birth DATE DEFAULT NULL, -- or DEFAULT 'YYYY-MM-DD' if you want a specific default date
      profile_picture TEXT DEFAULT NULL, -- or DEFAULT ''
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );  
  `);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      start_date DATE,
      end_date DATE,
      difficulty_level VARCHAR(50),
      topic VARCHAR(255),
      cover_image TEXT,
      teacher_id INTEGER REFERENCES users(id),
      status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      file_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})  
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      submission_url TEXT,
      score INTEGER,
      feedback TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS tests (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      correct_answer VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS options (
      id SERIAL PRIMARY KEY,
      question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
      option_text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS test_results (
      id SERIAL PRIMARY KEY,
      test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);})
    .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER REFERENCES users(id),
      receiver_id INTEGER REFERENCES users(id),
      message_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`)})
  .then(() => {return client.query(`CREATE TABLE IF NOT EXISTS student_projects (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`)})
   

  .then(() => {console.log('Database connection established. Tables are ready.');})
  .catch((err) => {console.error('Error: ', err + ".");});

  router.get('/submissions', async (req, res) => {
    try {
      const result = await client.query(`
        SELECT s.id, s.student_id, u.id AS student_name, m.title AS module_title, p.title AS project_title, s.submission_url, s.score 
        FROM submissions s
        JOIN tasks t ON s.task_id = t.id
        JOIN modules m ON t.module_id = m.id
        JOIN projects p ON m.project_id = p.id
        JOIN users u ON s.student_id = u.id
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).send('Server Error');
    }
  });

  // Route to get student data
router.get('/download/student/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const student = await client.query(
      'SELECT full_name, email, username FROM users WHERE id = $1 AND role = $2',
      [userId, 'ученик']
    );

    const projects = await client.query(
      `SELECT p.title, s.score 
       FROM projects p 
       JOIN student_projects sp ON p.id = sp.project_id 
       JOIN submissions s ON s.student_id = sp.student_id 
       WHERE sp.student_id = $1`,
      [userId]
    );

    const data = {
      ...student.rows[0],
      projects: projects.rows,
    };

    res.json(data); // Optionally, you can convert this to a CSV or any other format
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Route to get teacher data
router.get('/download/teacher/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const teacher = await client.query(
      'SELECT full_name, email, username FROM users WHERE id = $1 AND role = $2',
      [userId, 'учитель']
    );

    const modules = await client.query(
      `SELECT m.title, s.score, s.student_id 
       FROM modules m 
       JOIN projects p ON m.project_id = p.id 
       JOIN submissions s ON s.task_id = m.id 
       WHERE p.teacher_id = $1`,
      [userId]
    );

    const mostFamousCourse = await client.query(
      `SELECT title 
       FROM projects 
       WHERE teacher_id = $1 
       ORDER BY (SELECT COUNT(*) FROM student_projects WHERE project_id = projects.id) DESC 
       LIMIT 1`,
      [userId]
    );

    const data = {
      ...teacher.rows[0],
      modules: modules.rows,
      mostFamousCourse: mostFamousCourse.rows[0]?.title || 'N/A',
    };

    res.json(data); // Optionally, you can convert this to a CSV or any other format
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


  
  // Endpoint to get test results
  router.get('/test_results', async (req, res) => {
    try {
      const result = await client.query(`
        SELECT tr.id, tr.student_id, u.id AS student_name, m.title AS module_title, p.title AS project_title, tr.score AS grade
        FROM test_results tr
        JOIN tests t ON tr.test_id = t.id
        JOIN modules m ON t.project_id = m.id
        JOIN projects p ON m.project_id = p.id
        JOIN users u ON tr.student_id = u.id
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching test results:', error);
      res.status(500).send('Server Error');
    }
  });
  
  // Endpoint to update submission grade
  router.put('/submissions/:id', async (req, res) => {
    const { id } = req.params;
    const { grade } = req.body;
    try {
      await client.query('UPDATE submissions SET score = $1 WHERE id = $2', [grade, id]);
      res.status(200).send('Grade updated successfully');
    } catch (error) {
      console.error('Error updating submission grade:', error);
      res.status(500).send('Server Error');
    }
  });
  
  // Endpoint to update test result grade
  router.put('/test_results/:id', async (req, res) => {
    const { id } = req.params;
    const { grade } = req.body;
    try {
      await client.query('UPDATE test_results SET score = $1 WHERE id = $2', [grade, id]);
      res.status(200).send('Grade updated successfully');
    } catch (error) {
      console.error('Error updating test result grade:', error);
      res.status(500).send('Server Error');
    }
  });
  // Endpoint to handle student task submissions
router.post('/modules/:module_id/tasks/:task_id/submit', async (req, res) => {
  const { module_id, task_id } = req.params;
  const { student_id, submission_url } = req.body;
  try {
    await client.query(
      'INSERT INTO submissions (student_id, task_id, submission_url) VALUES ($1, $2, $3)',
      [student_id, task_id, submission_url]
    );
    res.status(200).send('Task submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
  router.get('/all-projects', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM projects');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  // Retrieve all projects associated with a student
  router.get('/students/:student_id/projects', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await client.query(
      `SELECT projects.* 
       FROM projects 
       JOIN student_projects ON projects.id = student_projects.project_id 
       WHERE student_projects.student_id = $1`,
      [student_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Get total number of submissions for a student
router.get('/students/:student_id/submissions/count', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await client.query(
      'SELECT COUNT(*) FROM submissions WHERE student_id = $1',
      [student_id]
    );
    res.json(result.rows[0].count);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get grades per subject for a student
router.get('/students/:student_id/grades', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await client.query(
      `SELECT p.topic, AVG(s.score) as average_score 
       FROM submissions s
       JOIN tasks t ON s.task_id = t.id
       JOIN modules m ON t.module_id = m.id
       JOIN projects p ON m.project_id = p.id
       WHERE s.student_id = $1
       GROUP BY p.topic`,
      [student_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get total number of courses a student is subscribed to
app.get('/students/:student_id/courses/count', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM student_projects WHERE student_id = $1',
      [student_id]
    );
    res.json(result.rows[0].count);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
  
  // Endpoint to handle adding the project for students
  router.post('/all-projects/:projectId/add', async (req, res) => {
    const { projectId } = req.params;
    const userId = req.body.postData.id
    try {
    const check = await client.query(`
    SELECT * FROM student_projects WHERE student_id = $1 AND project_id = $2`, [userId, projectId])
    if (check.rowCount != 0) {
      return res.status(201).send('Проект уже добавлен')  
    }
    await client.query(`
    INSERT INTO student_projects (student_id, project_id) VALUES ($1, $2) RETURNING id`,
    [userId, projectId])
    res.status(200).send('Проект Добавлен');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  router.get('/students/:student_id/projects', async (req, res) => {
    const { student_id } = req.params;
    try {
      const result = await client.query(
        `SELECT projects.* 
         FROM projects 
         JOIN student_projects ON projects.id = student_projects.project_id 
         WHERE student_projects.student_id = $1`,
        [student_id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
//POST endpoint for contact section
router.post('/contact', async (req, res) => {
  const { FirstName, LastName, email, Message } = req.body;
  (async () => {
    try {
      const result = await client.query(
        'INSERT INTO Messages (first_name, last_name, email, message) VALUES ($1, $2, $3, $4) RETURNING id',
        [FirstName, LastName, email, Message]
      );
  
      res.status(201).send(`Your message has been sent!`);
      console.log('Message Inserted');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred. Please try again later');
    } finally {
      // await client.end();
    }
  })();
});
// Endpoint to set user's date of birth
router.put('/users/:userId/dateOfBirth', isAuthenticated, async (req, res) => {
  const userId = req.params.userId;
  const { dateOfBirth } = req.body;

  try {
    const result = await client.query(
      'UPDATE users SET date_of_birth = $1 WHERE email = $2 RETURNING *',
      [dateOfBirth, userId]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error setting date of birth:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
//Endpont to set user's FIO
router.put('/users/:userId/fio', isAuthenticated, async (req, res) => {
  const userId = req.params.userId;
  const { FIO } = req.body;

  try {
    const result = await client.query(
      'UPDATE users SET full_name = $1 WHERE email = $2 RETURNING *',
      [FIO, userId]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error updating FIO:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
router.get('/projects/pending', isAuthenticated, checkRole(['admin', 'owner']), async(req, res) => {

})


//POST endpoint for user sign up
router.post('/sign',
  [
    body('username').isString().isLength({ min: 1 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8 }).trim(),
    body('role').toLowerCase().isIn(['ученик', 'учитель']).withMessage('Role must be either ученик or учитель')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await client.query(
        'INSERT INTO Users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [username, hashedPassword, email, role]
      );

      res.status(201).json({ message: 'User created', userId: result.rows[0].id });
      console.log('User Created.');
    } catch (err) {
      if (err.code === '23505') {
        res.status(409).json({ message: 'Username or email is already registered' });
      } else {
        console.error('Error inserting user:', err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
      }
    }
  }
);

// POST endpoint for user login
router.post('/login',
  [
    body('username').isString().isLength({ min: 1 }).trim(),
    body('password').isString().isLength({ min: 6 }).trim(),
    body('captchaToken').notEmpty().withMessage('reCAPTCHA token is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, captchaToken } = req.body;

    try {
      const userResult = await client.query('SELECT * FROM Users WHERE username = $1', [username]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  }
);


//Endpoint for adding items to catalog
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/projects/add',
  upload.single('coverImage'), // Handle single file upload for cover image
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('description').isString().trim(),
    body('startDate').isDate().optional({ checkFalsy: true }),
    body('endDate').isDate().optional({ checkFalsy: true }),
    body('difficultyLevel').isString().trim(),
    body('topic').isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, startDate, endDate, difficultyLevel, topic } = req.body;
    const coverImage = req.file ? req.file.path : null;

    try {
      const userNew = await client.query(
        `SELECT * FROM Users WHERE email = $1`, [req.body.teacherEmail]
      )
      const result = await client.query(
        `INSERT INTO projects (title, description, start_date, end_date, difficulty_level, topic, cover_image, teacher_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [title, description, startDate, endDate, difficultyLevel, topic, coverImage, userNew.rows[0].id, 'pending']
      );

      res.status(201).json({ message: 'Project added successfully', projectId: result.rows[0].id });
    } catch (err) {
      console.error('Error adding project:', err);
      res.status(500).json({ message: 'An error occurred while adding the project' });
    }
  }
);



app.use(cors());

//Endpoint to fetch user info
router.get('/user-info/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required' });
    }

    const result = await client.query(
      "SELECT * FROM Users WHERE username = $1", [username.toString()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows);
   
  } catch (err) {
    console.error('Error fetching user information:', err);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

async function usernameExists(username) {
  const result = await client.query('SELECT 1 FROM Users WHERE username = $1', [username]);
  return result.rowCount > 0;
}
//Endpoint to update a user's username
router.post('/update-username', async (req, res) => {
  const { username, newUsername } = req.body;

  try {
    const exists = await usernameExists(newUsername);

    if (exists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const updateResult = await client.query(
      'UPDATE Users SET username = $1 WHERE username = $2 RETURNING username',
      [newUsername, username]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Username updated', newUsername: updateResult.rows[0].username });
  } catch (error) {
    console.error('Error updating username:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

//Endpoint to update user email
router.put('/user/change-email', isAuthenticated, checkRole(['user', 'owner']), async (req, res) => {
  const { newEmail } = req.body; // New email provided by the user
  const { user } = req; // Authenticated user from JWT middleware

  if (!newEmail) {
    return res.status(400).json({ error: 'New email is required.' });
  }

  try {
    // Check if the new email is already registered
    const emailCheck = await client.query(
      'SELECT * FROM Users WHERE email = $1',
      [newEmail]
    );

    if (emailCheck.rowCount > 0) {
      return res.status(409).json({ error: 'Email is already in use.' });
    }

    // Update the user's email in the database
    await client.query(
      'UPDATE Users SET email = $1 WHERE id = $2',
      [newEmail, user.userId]
    );

    res.status(200).json({ message: 'Email changed successfully.' });
  } catch (error) {
    console.error('Error changing email:', error);
    res.status(500).json({ error: 'An error occurred while changing your email.' });
  }
});

// Endpoint to change user username
router.put('/user/change-username', isAuthenticated, checkRole(['user', 'owner']), async (req, res) => {
  const { newUsername } = req.body; // New username provided by the user
  const { user } = req; // Authenticated user from JWT middleware

  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required.' });
  }

  try {
    // Check if the new username is already registered
    const usernameCheck = await client.query(
      'SELECT * FROM Users WHERE username = $1',
      [newUsername]
    );

    if (usernameCheck.rowCount > 0) {
      return res.status(409).json({ error: 'Username is already in use.' });
    }

    // Update the user's username in the database
    await client.query(
      'UPDATE Users SET username = $1 WHERE id = $2',
      [newUsername, user.userId]
    );

    res.status(200).json({ message: 'Username changed successfully.' });
  } catch (error) {
    console.error('Error changing username:', error);
    res.status(500).json({ error: 'An error occurred while changing your username.' });
  }
});

// Endpoint to change user password and invalidate sessions
router.put('/user/change-password', isAuthenticated, checkRole(['user', 'owner']), async (req, res) => {
  const { currentPassword, newPassword } = req.body; // Current and new passwords
  const { user } = req; // Authenticated user from JWT middleware

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required.' });
  }

  try {
    // Get the stored hashed password for the user
    const userResult = await client.query(
      'SELECT * FROM Users WHERE id = $1',
      [user.userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const storedHashedPassword = userResult.rows[0].password; // Hashed password from DB

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, storedHashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect current password.' });
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await client.query(
      'UPDATE Users SET password = $1 WHERE id = $2',
      [newHashedPassword, user.userId]
    );

    // Generate a new JWT token to invalidate the old token
    const newToken = jwt.sign(
      { id: user.userId, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' } // Set a new expiration time
    );

    // Return the new token, indicating the user needs to re-authenticate
    res.status(200).json({
      message: 'Password changed successfully.',
      newToken,
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing your password.' });
  }
});

//Ednpoint to delete users
router.delete('/user', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(400).json({ error: 'Email or username must be provided' });
  }

  try {
    // Get the user details before deleting
    const userCondition = email ? 'email = $1' : 'username = $1';
    const userValue = email || username;

    const userResult = await client.query(
      `SELECT * FROM Users WHERE ${userCondition}`,
      [userValue]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Store user information in DeletedUsers
    const user = userResult.rows[0];
    if (user.role === 'user' || checkRole(['owner'])) {
    await client.query(
      `INSERT INTO DeletedUsers (username, password, email, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      [user.username, user.password, user.email]
    );

    // Delete the user from the Users table
    await client.query(`DELETE FROM Users WHERE ${userCondition}`, [userValue]);

    res.status(200).json({ message: 'User deleted and info stored successfully' });
    }
    else {
      res.status(228).json({message: 'Please, do not delete other admins'})
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});
//Ednpoint to change user stuff (admin)
router.put('/user/update', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { targetEmail, targetUsername, newUsername, newEmail, newPassword } = req.body;

  let targetField;
  let targetValue;

  // Determine the target field (email or username)
  if (targetEmail) {
    targetField = 'email';
    targetValue = targetEmail;
  } else if (targetUsername) {
    targetField = 'username';
    targetValue = targetUsername;
  } else {
    return res.status(400).json({ error: 'Target email or username is required' });
  }

  try {
    // Validate if the user exists
    const userResult = await client.query(
      `SELECT * FROM Users WHERE ${targetField} = $1`,
      [targetValue]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = [];
    const values = [];
    let i = 2; // Starting index for placeholders

    // Push updates and associated values in the correct order
    if (newUsername) {
      // Check for unique username
      const usernameCheck = await client.query(
        `SELECT * FROM Users WHERE username = $1`,
        [newUsername]
      );
      if (usernameCheck.rowCount > 0) {
        return res.status(409).json({ error: 'Username already in use' });
      }
      updates.push(`username = $${i}`); // Ensure correct placeholder
      values.push(newUsername);
      i++; // Increment index
    }

    if (newEmail) {
      // Check for unique email
      const emailCheck = await client.query(
        `SELECT * FROM Users WHERE email = $1`,
        [newEmail]
      );
      if (emailCheck.rowCount > 0) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.push(`email = $${i}`); // Ensure correct placeholder
      values.push(newEmail);
      i++; // Increment index
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.push(`password = $${i}`); // Ensure correct placeholder
      values.push(hashedPassword);
    }

    // Construct the UPDATE query with correct indexing
    const updateQuery = `UPDATE Users SET ${updates.join(', ')} WHERE ${targetField} = $1`;
    
    // Execute the query with correct parameter count
    await client.query(
      updateQuery,
      [targetValue, ...values] // Ensure parameter count matches placeholders
    );

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});


//Endpoint to delete an item from the catalog
router.delete('/product/:id', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const catalogId = parseInt(req.params.id);

  if (isNaN(catalogId)) {
    return res.status(400).json({ error: 'Invalid catalog ID' });
  }

  try {
    const deleteResult = await client.query(
      'DELETE FROM Catalog WHERE id = $1',
      [catalogId]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'An error occurred while deleting the item' });
  }
});
router.get('/project/:id',  isAuthenticated, checkRole(['admin', 'учитель']), async (req, res) => {
  const id  = req.params.id;
  try {
    const projectResult = await client.query('SELECT * FROM projects WHERE id = $1', [id]);
    const modulesResult = await client.query('SELECT * FROM modules WHERE project_id = $1', [id]);
    res.json({ project: projectResult.rows[0], modules: modulesResult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/projects/:id/modules', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await client.query('INSERT INTO modules (project_id, title, description) VALUES ($1, $2, $3) RETURNING *', [id, title, description]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, difficulty_level, topic, cover_image, status } = req.body;
  try {
    const result = await client.query(
      'UPDATE projects SET title = $1, description = $2, start_date = $3, end_date = $4, difficulty_level = $5, topic = $6, cover_image = $7, status = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [title, description, start_date, end_date, difficulty_level, topic, cover_image, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM projects WHERE id = $1', [id]);
    res.send('Project deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.put('/modules/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await client.query(
      'UPDATE modules SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
router.get('/projects/:project_id/modules', async (req, res) => {
  const { project_id } = req.params;
  try {
    const moduls = await client.query(
      'SELECT * FROM modules WHERE project_id = $1',
      [project_id]
    );

    const allModules = moduls.rows;
    let tasks = [];
    await Promise.all(allModules.map(async (m) => {
      const taskResult = await client.query(
        `SELECT * FROM tasks WHERE module_id = $1`,
        [m.id]
      );
      tasks = [...tasks, ...taskResult.rows];
    }));
    sendData = {
      tasks: tasks,
      modules: moduls.rows,
    };
    res.json(sendData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.delete('/modules/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM modules WHERE id = $1', [id]);
    res.send('Module deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/tasks/:moduleId', async (req, res) => {
  const { moduleId } = req.params;
  const { title, description, file_url } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO tasks (module_id, title, description, file_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [moduleId, title, description, file_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, file_url } = req.body;
  try {
    const result = await client.query(
      'UPDATE tasks SET title = $1, description = $2, file_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, file_url, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.send('Task deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


//Endpoint to grant admin (Owner only)
router.put('/owner/grant-admin', isAuthenticated, checkRole(['owner']), async (req, res) => {
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(400).json({ error: 'Email or username must be provided' });
  }

  let condition;
  let value;

  // Determine whether granting admin by email or username
  if (email) {
    condition = 'email = $1';
    value = email;
  } else {
    condition = 'username = $1';
    value = username;
  }

  try {
    // Check if the user exists
    const userResult = await client.query(
      `SELECT * FROM Users WHERE ${condition}`,
      [value]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user role to 'admin'
    await client.query(
      `UPDATE Users SET role = 'admin' WHERE ${condition}`,
      [value]
    );

    res.status(200).json({ message: 'Admin privileges granted successfully' });
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    res.status(500).json({ error: 'An error occurred while granting admin privileges' });
  }
});


// Endpoint to revoke admin privileges (Owner only)
router.put('/user/revoke-admin', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  const { email, username } = req.body;

  if (!email && !username) {
    return res.status(400).json({ error: 'Email or username must be provided' });
  }

  let condition;
  let value;

  // Determine whether to revoke by email or username
  if (email) {
    condition = 'email = $1';
    value = email;
  } else {
    condition = 'username = $1';
    value = username;
  }

  try {
    // Check if the user exists
    const userResult = await client.query(
      `SELECT * FROM Users WHERE ${condition}`,
      [value]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Revoke admin access by setting the role to 'user'
    await client.query(
      `UPDATE Users SET role = 'user' WHERE ${condition}`,
      [value]
    );

    res.status(200).json({ message: 'Admin privileges revoked successfully' });
  } catch (error) {
    console.error('Error revoking admin privileges:', error);
    res.status(500).json({ error: 'An error occurred while revoking admin privileges' });
  }
});

//Endpoint for user to delete their account
router.delete('/user/delete-account', isAuthenticated, async (req, res) => {
  const { confirmationPassword } = req.body; // Password for confirmation
  const { user } = req; // Authenticated user from JWT middleware

  if (!confirmationPassword) {
    return res.status(400).json({ error: 'Confirmation password is required.' });
  }

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in to delete your account.' });
  }

  try {
    // Get user details from the database
    const userResult = await client.query(
      'SELECT * FROM Users WHERE id = $1',
      [user.userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const storedHashedPassword = userResult.rows[0].password; // Hashed password from DB   

    // Validate the confirmation password
    const isPasswordValid = await bcrypt.compare(confirmationPassword, storedHashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect confirmation password. Cannot delete account.' });
    }

    // If everything is okay, proceed with account deletion
    await client.query(
      'DELETE FROM Users WHERE id = $1',
      [user.userId]
    );

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'An error occurred while deleting your account.' });
  }
});


// Endpoint to get all open tickets, sorted by priority
router.get('/admin/tickets/open', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM Tickets WHERE status = $1 ORDER BY priority, created_at DESC',
      ['open'] // Filter for open tickets, sorted by priority and then by creation time
    );

    res.status(200).json({
      tickets: result.rows, // Return the list of open tickets
    });
  } catch (error) {
    console.error('Error retrieving open tickets:', error);
    res.status(500).json({ error: 'An error occurred while retrieving open tickets.' });
  }
});
// Endpoint to get the most famous project for a teacher
router.get('/teachers/:teacher_id/most_famous_project', async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const result = await client.query(
      `SELECT p.*
       FROM projects p
       JOIN student_projects sp ON p.id = sp.project_id
       WHERE p.teacher_id = $1
       GROUP BY p.id
       ORDER BY COUNT(sp.project_id) DESC
       LIMIT 1`,
      [teacher_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get the module count for a teacher
router.get('/teachers/:teacher_id/module_count', async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const result = await client.query(
      `SELECT COUNT(*) AS module_count
       FROM modules m
       JOIN projects p ON m.project_id = p.id
       WHERE p.teacher_id = $1`,
      [teacher_id]
    );
    res.json(result.rows[0].module_count);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get student results for a teacher
router.get('/teachers/:teacher_id/student_results', async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const result = await client.query(
      `SELECT s.student_id, u.id AS student_name, s.score
       FROM submissions s
       JOIN tasks t ON s.task_id = t.id
       JOIN modules m ON t.module_id = m.id
       JOIN projects p ON m.project_id = p.id
       JOIN users u ON s.student_id = u.id
       WHERE p.teacher_id = $1`,
      [teacher_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// Get all pending projects
router.get('/projects', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  try {
      const result = await client.query("SELECT * FROM projects WHERE status = 'pending'");
      res.json(result.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
router.get('/projects/:email', isAuthenticated, checkRole(['учитель', 'admin']), async(req, res) => {
  const userEmail= req.params.email;
  const idData = await client.query(`
  SELECT * FROM Users WHERE email = $1`, [userEmail])
  const userId = idData.rows[0].id
  const result = await client.query(`
  SELECT * FROM PROJECTS WHERE teacher_id =$1`, [userId]);
  if (result.rows === 0) {
    return res.status(400).send('There are no peojects associated with the teacher')
  }
  else {
    res.json(result.rows)
  }
})
router.delete('/projects/:projectId', isAuthenticated, checkRole(['admin', 'учитель']), async(req, res) => {
  const projectId = req.params.projectId
  try {
  await client.query(`
  DELETE * FROM projects WHERE id = $1`, [projectId]);
  res.status(200).send('Sucessfully deleted')
  }
  catch (error){
    return res.status(500).send('Error:', error)
  }
})
// Approve a project
router.post('/projects/:id/approve', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  try {
      const { id } = req.params;
      await client.query("UPDATE projects SET status = 'approved' WHERE id = $1", [id]);
      res.json({ message: 'Project approved' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Reject a project
router.post('/projects/:id/reject', isAuthenticated, checkRole(['admin', 'owner']), async (req, res) => {
  try {
      const { id } = req.params;
      await client.query("UPDATE projects SET status = 'rejected' WHERE id = $1", [id]);
      res.json({ message: 'Project rejected' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' }); // Validate input
  }

  try {
    // Verify the refresh token using the refresh secret key
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY); // Use refresh secret key
    const userId = decoded.userId; // Extract user ID from decoded token

    // Query the database to confirm the user exists
    const result = await client.query('SELECT * FROM Users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' }); // Handle user not found
    }

    const user = result.rows[0];

    // Issue a new access token
    const newToken = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    res.status(200).json({user:user, token: newToken }); // Return the new access token
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;