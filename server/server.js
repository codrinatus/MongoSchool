const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({error: 'Unauthorized - Missing token'});
    }

    const extractedToken = token.split(' ')[1];


    jwt.verify(extractedToken, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Unauthorized - Invalid token'});
        }

        req.user = decoded;

        next();
    });
};

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'MongoSchool API',
            version: '1.0.0',
            description: '',
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const app = express();
app.use(cors());
app.use((req, res, next) => {
    if (req.path !== '/api/auth' && req.path !== '/api/register' && !req.path.startsWith('/api-docs')) {
        verifyToken(req, res, next);
    } else {
        next();
    }
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://127.0.0.1:27017/Liceu', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('users', userSchema);

const elevSchema = new mongoose.Schema({
    nume: String,
    prenume: String,
    clasa: String

})

const Elev = mongoose.model('elevi', elevSchema);

const profSchema = new mongoose.Schema({
    nume: String,
    prenume: String,
    materie: String

})

const Prof = mongoose.model('prof', profSchema);

const noteSchema = new mongoose.Schema({
    materie: String,
    elev: String,
    nota: String

})

const Note = mongoose.model('note', noteSchema);

const claseSchema = new mongoose.Schema({
    numar_elevi: String,
    nume: String,
    nivel: String

})

const Clase = mongoose.model('classe', claseSchema);



const secretKey = "meow";

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate a user
 *     description: Authenticate a user and get a token
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             example:
 *               token: <jwt_token>
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid credentials
 */

app.post('/api/auth',
    async (req, res) => {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        console.log(user);

        if (!user) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const token = jwt.sign({username: user.username}, secretKey, {expiresIn: '12h'});
        console.log(token);

        res.json({token});
    });

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a username and password
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       400:
 *         description: Username already exists
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */


app.post('/api/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({error: 'Username already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * definitions:
 *   Profesor:
 *     type: object
 *     properties:
 *       nume:
 *         type: string
 *       prenume:
 *         type: string
 *       materie:
 *         type: string
 */

/**
 * @swagger
 * /api/profesori:
 *   post:
 *     summary: Insert values into Profesori collection
 *     description: Insert a new record into the Profesori collection.
 *     parameters:
 *       - name: attribute1
 *         in: formData
 *         required: true
 *         type: string
 *         description: First attribute for Profesor
 *       - name: attribute2
 *         in: formData
 *         required: true
 *         type: string
 *         description: Second attribute for Profesor
 *       - name: attribute3
 *         in: formData
 *         required: true
 *         type: string
 *         description: Third attribute for Profesor
 *     responses:
 *       201:
 *         description: Profesor record inserted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

app.post('/api/profesori', verifyToken, async (req, res) => {
    const {attribute1, attribute2, attribute3} = req.body;

    try {
        const newProf = new Prof({
            nume: attribute1,
            prenume: attribute2,
            materie: attribute3
        });

        await newProf.save();

        res.status(201).json({message: 'Prof registered successfully'});
    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * /api/profesori:
 *   get:
 *     summary: Get all records from the Profesori collection
 *     description: Retrieve a list of all Profesori records.
 *     responses:
 *       200:
 *         description: Successful response with array of Profesori records
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Profesor'
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */



app.get('/api/profesori', verifyToken, async (req, res) => {
    try {
        const data = await Prof.find();
        res.send(data).status(200);

    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * definitions:
 *   Elev:
 *     type: object
 *     properties:
 *       nume:
 *         type: string
 *       prenume:
 *         type: string
 *       clasa:
 *         type: string
 */

/**
 * @swagger
 * /api/elevi:
 *   post:
 *     summary: Insert values into Elevi collection
 *     description: Insert a new record into the Elevi collection.
 *     parameters:
 *       - name: attribute1
 *         in: formData
 *         required: true
 *         type: string
 *         description: First attribute for Elev
 *       - name: attribute2
 *         in: formData
 *         required: true
 *         type: string
 *         description: Second attribute for Elev
 *       - name: attribute3
 *         in: formData
 *         required: true
 *         type: string
 *         description: Third attribute for Elev
 *     responses:
 *       201:
 *         description: Elev record inserted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */


app.post('/api/elevi', verifyToken, async (req, res) => {
    const {attribute1, attribute2, attribute3} = req.body;

    try {
        const newElev = new Elev({
            nume: attribute1,
            prenume: attribute2,
            clasa: attribute3
        });

        await newElev.save();

        res.status(201).json({message: 'Elev registered successfully'});
    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * /api/elevi:
 *   get:
 *     summary: Get all records from the Elevi collection
 *     description: Retrieve a list of all Elevi records.
 *     responses:
 *       200:
 *         description: Successful response with array of Elevi records
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Elev'
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */


app.get('/api/elevi', verifyToken, async (req, res) => {
    try {
        const data = await Elev.find();
        res.send(data).status(200);

    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * definitions:
 *   Clase:
 *     type: object
 *     properties:
 *       numar_elevi:
 *         type: string
 *       nume:
 *         type: string
 *       nivel:
 *         type: string
 */

/**
 * @swagger
 * /api/clase:
 *   post:
 *     summary: Insert values into Clase collection
 *     description: Insert a new record into the Clase collection.
 *     parameters:
 *       - name: attribute1
 *         in: formData
 *         required: true
 *         type: string
 *         description: First attribute for Clase
 *       - name: attribute2
 *         in: formData
 *         required: true
 *         type: string
 *         description: Second attribute for Clase
 *       - name: attribute3
 *         in: formData
 *         required: true
 *         type: string
 *         description: Third attribute for Clase
 *     responses:
 *       201:
 *         description: Clase record inserted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */


app.post('/api/clase', verifyToken, async (req, res) => {
    const {attribute1, attribute2, attribute3} = req.body;

    try {
        const newClase = new Clase({
            numar_elevi: attribute1,
            nume: attribute2,
            nivel: attribute3
        });

        await newClase.save();

        res.status(201).json({message: 'Clasa registered successfully'});
    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * /api/clase:
 *   get:
 *     summary: Get all records from the Clase collection
 *     description: Retrieve a list of all Clase records.
 *     responses:
 *       200:
 *         description: Successful response with array of Clase records
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Clase'
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

app.get('/api/clase', verifyToken, async (req, res) => {
    try {
        const data = await Clase.find();
        res.send(data).status(200);

    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * definitions:
 *   Note:
 *     type: object
 *     properties:
 *       materie:
 *         type: string
 *       elev:
 *         type: string
 *       nota:
 *         type: string
 */

/**
 * @swagger
 * /api/note:
 *   post:
 *     summary: Insert values into Note collection
 *     description: Insert a new record into the Note collection.
 *     parameters:
 *       - name: attribute1
 *         in: formData
 *         required: true
 *         type: string
 *         description: First attribute for Note
 *       - name: attribute2
 *         in: formData
 *         required: true
 *         type: string
 *         description: Second attribute for Note
 *       - name: attribute3
 *         in: formData
 *         required: true
 *         type: string
 *         description: Third attribute for Note
 *     responses:
 *       201:
 *         description: Note record inserted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

app.post('/api/note', verifyToken, async (req, res) => {
    const {attribute1, attribute2, attribute3} = req.body;

    try {
        const newNote = new Note({
            materie: attribute1,
            elev: attribute2,
            nota: attribute3
        });

        await newNote.save();

        res.status(201).json({message: 'Nota registered successfully'});
    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/**
 * @swagger
 * /api/note:
 *   get:
 *     summary: Get all records from the Note collection
 *     description: Retrieve a list of all Note records.
 *     responses:
 *       200:
 *         description: Successful response with array of Note records
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Note'
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */


app.get('/api/note', verifyToken, async (req, res) => {
    try {
        const data = await Note.find();
        res.send(data).status(200);

    } catch (error) {
        console.error('Error during insert:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});
