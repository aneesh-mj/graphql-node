var express = require('express');
const { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');


// GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        author(id: Int!): Author
    },
    type Course {
        id: Int
        title: String
        author: Author
        description: String
        topic: String
        url: String
    }
    type Author {
        id: String
        name: String
    }
`);

const authors = [
    {
        id: 'auth01',
        name: 'Andrew Mead, Rob Percival'
    },

    {
        id: 'auth02',
        name: 'Brad Traversy'
    },

    {
        id: 'auth03',
        name: 'Anthony Alicea'
    },
];

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'auth01',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'auth02',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'auth03',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];





var getCourse = function (args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
};
// {}

let authorMap;

class Course {
    constructor(data) {
        this.course = data;

        if (!authorMap) {
            authorMap = {};
            authors.map(a => {
                authorMap[a.id] = a;
            })
        }
    }

    async author() {
        const authorId = this.course.author;
        return await getAuthor(authorId);
    }

    description() {
        return this.course.description;
    }

}

const getAuthor = async (id) => {
    return new Promise(resolve => {
        resolve(authorMap[id]);
    });
}

const getCourses = async () => {
    const data = coursesData.map(c => {
        return new Course(c)
    });
    return new Promise(resolve => {
        resolve(data);
    });
}

var root = {
    course: getCourse,
    courses: async () => {
        return await getCourses();
    }
};


// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));