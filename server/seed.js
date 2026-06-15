const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");
const Attempt = require("./models/Attempt");

const DB_URL = process.env.DB_URL;

const seedData = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to Database");

    await Quiz.deleteMany({
      title: {
        $in: [
          "JavaScript Fundamentals",
          "React Mastery",
          "Node.js & Express",
          "React Advanced Patterns",
          "Agile Development",
          "TypeScript Essentials",
          "CSS & Tailwind",
          "System Design Basics",
        ],
      },
    });
    console.log("🧹 Cleaned old seed data");

    // Admin user
    let admin = await User.findOne({ email: "admin@quizzy.com" });
    if (!admin) {
      admin = await User.create({
        username: "QuizzyAdmin",
        email: "admin@quizzy.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      });
      console.log("👑 Admin created: admin@quizzy.com / admin123");
    } else {
      console.log("👑 Admin already exists: admin@quizzy.com / admin123");
    }

    // Student user
    let student = await User.findOne({ email: "student@quizzy.com" });
    if (!student) {
      student = await User.create({
        username: "TestStudent",
        email: "student@quizzy.com",
        password: await bcrypt.hash("student123", 10),
        role: "user",
      });
      console.log("🎓 Student created: student@quizzy.com / student123");
    } else {
      console.log("🎓 Student already exists: student@quizzy.com / student123");
    }

    // ─── Quiz 1: JavaScript Fundamentals ─────────────────────────────
    const jsQuiz = await Quiz.create({
      title: "JavaScript Fundamentals",
      description: "Test your core JavaScript knowledge — variables, functions, closures, and more.",
      timer: 10,
      createdBy: admin._id,
    });
    const jsQuestions = await Question.create([
      {
        quizId: jsQuiz._id,
        questionText: "What is the output of typeof null in JavaScript?",
        options: [
          { text: "null", isCorrect: false },
          { text: "object", isCorrect: true },
          { text: "undefined", isCorrect: false },
          { text: "string", isCorrect: false },
        ],
      },
      {
        quizId: jsQuiz._id,
        questionText: "Which method removes the last element from an array?",
        options: [
          { text: "shift()", isCorrect: false },
          { text: "splice()", isCorrect: false },
          { text: "pop()", isCorrect: true },
          { text: "slice()", isCorrect: false },
        ],
      },
      {
        quizId: jsQuiz._id,
        questionText: "What does '===' check in JavaScript?",
        options: [
          { text: "Value only", isCorrect: false },
          { text: "Type only", isCorrect: false },
          { text: "Value and type", isCorrect: true },
          { text: "Reference equality", isCorrect: false },
        ],
      },
      {
        quizId: jsQuiz._id,
        questionText: "Which keyword declares a block-scoped variable?",
        options: [
          { text: "var", isCorrect: false },
          { text: "let", isCorrect: true },
          { text: "function", isCorrect: false },
          { text: "global", isCorrect: false },
        ],
      },
      {
        quizId: jsQuiz._id,
        questionText: "What is a closure in JavaScript?",
        options: [
          { text: "A way to close the browser", isCorrect: false },
          { text: "A function that has access to its outer scope even after the outer function returns", isCorrect: true },
          { text: "A method to end a loop", isCorrect: false },
          { text: "An error handling mechanism", isCorrect: false },
        ],
      },
    ]);
    console.log("📝 JavaScript quiz created with 5 questions");

    // ─── Quiz 2: React Mastery ────────────────────────────────────────
    const reactQuiz = await Quiz.create({
      title: "React Mastery",
      description: "Deep dive into React hooks, state management, and component patterns.",
      timer: 12,
      createdBy: admin._id,
    });
    const reactQuestions = await Question.create([
      {
        quizId: reactQuiz._id,
        questionText: "Which hook is used to perform side effects in React?",
        options: [
          { text: "useState", isCorrect: false },
          { text: "useEffect", isCorrect: true },
          { text: "useContext", isCorrect: false },
          { text: "useRef", isCorrect: false },
        ],
      },
      {
        quizId: reactQuiz._id,
        questionText: "What does the second argument of useEffect control?",
        options: [
          { text: "The return value", isCorrect: false },
          { text: "The component name", isCorrect: false },
          { text: "When the effect runs (dependency array)", isCorrect: true },
          { text: "The initial state", isCorrect: false },
        ],
      },
      {
        quizId: reactQuiz._id,
        questionText: "What is the virtual DOM?",
        options: [
          { text: "A direct copy of the real DOM", isCorrect: false },
          { text: "A lightweight JavaScript representation of the DOM", isCorrect: true },
          { text: "A browser extension", isCorrect: false },
          { text: "A CSS framework", isCorrect: false },
        ],
      },
      {
        quizId: reactQuiz._id,
        questionText: "How do you pass data from parent to child in React?",
        options: [
          { text: "Using state", isCorrect: false },
          { text: "Using props", isCorrect: true },
          { text: "Using refs", isCorrect: false },
          { text: "Using context only", isCorrect: false },
        ],
      },
      {
        quizId: reactQuiz._id,
        questionText: "What does React.memo do?",
        options: [
          { text: "Memoizes the return value of a function", isCorrect: false },
          { text: "Prevents re-renders if props have not changed", isCorrect: true },
          { text: "Creates a new component", isCorrect: false },
          { text: "Stores data in localStorage", isCorrect: false },
        ],
      },
    ]);
    console.log("⚛️  React Mastery quiz created with 5 questions");

    // ─── Quiz 3: Node.js & Express ────────────────────────────────────
    const nodeQuiz = await Quiz.create({
      title: "Node.js & Express",
      description: "Backend fundamentals — middleware, routing, REST APIs, and async patterns.",
      timer: 15,
      createdBy: admin._id,
    });
    const nodeQuestions = await Question.create([
      {
        quizId: nodeQuiz._id,
        questionText: "What is middleware in Express.js?",
        options: [
          { text: "A database connector", isCorrect: false },
          { text: "A function that has access to req, res, and next", isCorrect: true },
          { text: "A type of HTTP method", isCorrect: false },
          { text: "A frontend library", isCorrect: false },
        ],
      },
      {
        quizId: nodeQuiz._id,
        questionText: "Which module is used to create an HTTP server in Node.js?",
        options: [
          { text: "fs", isCorrect: false },
          { text: "path", isCorrect: false },
          { text: "http", isCorrect: true },
          { text: "url", isCorrect: false },
        ],
      },
      {
        quizId: nodeQuiz._id,
        questionText: "What does async/await do in Node.js?",
        options: [
          { text: "Makes code run faster", isCorrect: false },
          { text: "Allows writing asynchronous code in a synchronous style", isCorrect: true },
          { text: "Creates multiple threads", isCorrect: false },
          { text: "Handles CSS animations", isCorrect: false },
        ],
      },
      {
        quizId: nodeQuiz._id,
        questionText: "What HTTP status code means Not Found?",
        options: [
          { text: "200", isCorrect: false },
          { text: "401", isCorrect: false },
          { text: "500", isCorrect: false },
          { text: "404", isCorrect: true },
        ],
      },
      {
        quizId: nodeQuiz._id,
        questionText: "What does JWT stand for?",
        options: [
          { text: "JavaScript Web Token", isCorrect: false },
          { text: "JSON Web Token", isCorrect: true },
          { text: "Java Web Transfer", isCorrect: false },
          { text: "JSON Web Transfer", isCorrect: false },
        ],
      },
    ]);
    console.log("🟢 Node.js quiz created with 5 questions");

    // ─── Quiz 4: React Advanced Patterns ─────────────────────────────
    const reactAdvQuiz = await Quiz.create({
      title: "React Advanced Patterns",
      description: "Advanced React concepts — hooks, context, performance optimization, and design patterns.",
      timer: 12,
      createdBy: admin._id,
    });
    await Question.create([
      {
        quizId: reactAdvQuiz._id,
        questionText: "What is the purpose of useCallback hook?",
        options: [
          { text: "To memoize a value", isCorrect: false },
          { text: "To memoize a function so it does not get recreated on every render", isCorrect: true },
          { text: "To fetch data from an API", isCorrect: false },
          { text: "To manage side effects", isCorrect: false },
        ],
      },
      {
        quizId: reactAdvQuiz._id,
        questionText: "What does useReducer return?",
        options: [
          { text: "A single state value", isCorrect: false },
          { text: "A dispatch function only", isCorrect: false },
          { text: "[state, dispatch]", isCorrect: true },
          { text: "[state, setState, reset]", isCorrect: false },
        ],
      },
      {
        quizId: reactAdvQuiz._id,
        questionText: "When should you use React Context?",
        options: [
          { text: "For all state management", isCorrect: false },
          { text: "To avoid prop drilling for global data like theme or auth", isCorrect: true },
          { text: "Only for styling", isCorrect: false },
          { text: "To replace all useState calls", isCorrect: false },
        ],
      },
      {
        quizId: reactAdvQuiz._id,
        questionText: "What is React.lazy used for?",
        options: [
          { text: "Delaying state updates", isCorrect: false },
          { text: "Code splitting — loading components only when needed", isCorrect: true },
          { text: "Lazy evaluation of props", isCorrect: false },
          { text: "Deferring useEffect execution", isCorrect: false },
        ],
      },
      {
        quizId: reactAdvQuiz._id,
        questionText: "What is the key prop used for in lists?",
        options: [
          { text: "Styling list items", isCorrect: false },
          { text: "Accessing DOM nodes", isCorrect: false },
          { text: "Helping React identify which items changed, added, or removed", isCorrect: true },
          { text: "Setting the tab order", isCorrect: false },
        ],
      },
      {
        quizId: reactAdvQuiz._id,
        questionText: "What does the useMemo hook do?",
        options: [
          { text: "Memoizes a callback function", isCorrect: false },
          { text: "Caches the result of an expensive computation between renders", isCorrect: true },
          { text: "Stores data in localStorage", isCorrect: false },
          { text: "Replaces useEffect", isCorrect: false },
        ],
      },
      {
        quizId: reactAdvQuiz._id,
        questionText: "What is a custom hook in React?",
        options: [
          { text: "A built-in React API", isCorrect: false },
          { text: "A function starting with use that reuses stateful logic across components", isCorrect: true },
          { text: "A class component method", isCorrect: false },
          { text: "A third-party library", isCorrect: false },
        ],
      },
    ]);
    console.log("⚛️  React Advanced Patterns quiz created with 7 questions");

    // ─── Quiz 5: Agile Development ────────────────────────────────────
    const agileQuiz = await Quiz.create({
      title: "Agile Development",
      description: "Test your understanding of Agile methodology, Scrum, Kanban, and best practices.",
      timer: 10,
      createdBy: admin._id,
    });
    await Question.create([
      {
        quizId: agileQuiz._id,
        questionText: "What is a Sprint in Scrum?",
        options: [
          { text: "A bug fixing session", isCorrect: false },
          { text: "A time-boxed iteration (usually 1-4 weeks) to deliver a working increment", isCorrect: true },
          { text: "A daily standup meeting", isCorrect: false },
          { text: "A release deployment", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What is the role of a Scrum Master?",
        options: [
          { text: "To manage the team and assign tasks", isCorrect: false },
          { text: "To write all the user stories", isCorrect: false },
          { text: "To facilitate the Scrum process and remove impediments", isCorrect: true },
          { text: "To approve all code changes", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What is a Product Backlog?",
        options: [
          { text: "A list of bugs to fix", isCorrect: false },
          { text: "An ordered list of everything that might be needed in the product", isCorrect: true },
          { text: "A sprint planning document", isCorrect: false },
          { text: "A deployment checklist", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What does Definition of Done mean in Agile?",
        options: [
          { text: "The project is fully complete", isCorrect: false },
          { text: "A shared checklist that defines when a user story is considered complete", isCorrect: true },
          { text: "The sprint has ended", isCorrect: false },
          { text: "All tests have been written", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What is the main difference between Scrum and Kanban?",
        options: [
          { text: "Scrum uses a board; Kanban does not", isCorrect: false },
          { text: "Kanban has fixed sprints; Scrum does not", isCorrect: false },
          { text: "Scrum uses time-boxed sprints; Kanban uses a continuous flow model", isCorrect: true },
          { text: "They are identical methodologies", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What is a Daily Standup (Daily Scrum)?",
        options: [
          { text: "A one-hour planning meeting", isCorrect: false },
          { text: "A 15-minute sync where team members share progress, plans, and blockers", isCorrect: true },
          { text: "A code review session", isCorrect: false },
          { text: "A retrospective meeting", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What is a Sprint Retrospective?",
        options: [
          { text: "A meeting to plan the next sprint", isCorrect: false },
          { text: "A demo of completed features to stakeholders", isCorrect: false },
          { text: "A meeting to reflect on what went well, what did not, and how to improve", isCorrect: true },
          { text: "A backlog grooming session", isCorrect: false },
        ],
      },
      {
        quizId: agileQuiz._id,
        questionText: "What are story points used for in Agile?",
        options: [
          { text: "Tracking hours worked", isCorrect: false },
          { text: "Estimating the relative effort and complexity of user stories", isCorrect: true },
          { text: "Counting lines of code", isCorrect: false },
          { text: "Measuring test coverage", isCorrect: false },
        ],
      },
    ]);
    console.log("🏃 Agile Development quiz created with 8 questions");

    // ─── Quiz 6: TypeScript Essentials ───────────────────────────────
    const tsQuiz = await Quiz.create({
      title: "TypeScript Essentials",
      description: "Core TypeScript concepts — types, interfaces, generics, and compiler features.",
      timer: 10,
      createdBy: admin._id,
    });
    await Question.create([
      {
        quizId: tsQuiz._id,
        questionText: "What is the difference between interface and type in TypeScript?",
        options: [
          { text: "They are completely identical", isCorrect: false },
          { text: "Interfaces can be extended and merged; types are more flexible with unions and intersections", isCorrect: true },
          { text: "Types are only for primitives", isCorrect: false },
          { text: "Interfaces cannot have methods", isCorrect: false },
        ],
      },
      {
        quizId: tsQuiz._id,
        questionText: "What does the readonly modifier do in TypeScript?",
        options: [
          { text: "Makes a variable constant at runtime", isCorrect: false },
          { text: "Prevents a property from being reassigned after initialization", isCorrect: true },
          { text: "Makes a class abstract", isCorrect: false },
          { text: "Disables type checking", isCorrect: false },
        ],
      },
      {
        quizId: tsQuiz._id,
        questionText: "What is a generic in TypeScript?",
        options: [
          { text: "A default value for a parameter", isCorrect: false },
          { text: "A way to create reusable components that work with any type", isCorrect: true },
          { text: "A built-in utility type", isCorrect: false },
          { text: "An abstract class", isCorrect: false },
        ],
      },
      {
        quizId: tsQuiz._id,
        questionText: "What does the unknown type mean in TypeScript?",
        options: [
          { text: "Same as any", isCorrect: false },
          { text: "A type-safe alternative to any — you must narrow the type before using it", isCorrect: true },
          { text: "A type that can only be null", isCorrect: false },
          { text: "An error type", isCorrect: false },
        ],
      },
      {
        quizId: tsQuiz._id,
        questionText: "What is a union type in TypeScript?",
        options: [
          { text: "A type that combines two objects", isCorrect: false },
          { text: "A type that can be one of several types, written with |", isCorrect: true },
          { text: "A type only used in generics", isCorrect: false },
          { text: "A type alias for arrays", isCorrect: false },
        ],
      },
      {
        quizId: tsQuiz._id,
        questionText: "What does the as keyword do in TypeScript?",
        options: [
          { text: "Converts a value at runtime", isCorrect: false },
          { text: "Performs a type assertion — tells the compiler to treat a value as a specific type", isCorrect: true },
          { text: "Creates a type alias", isCorrect: false },
          { text: "Imports a module", isCorrect: false },
        ],
      },
    ]);
    console.log("🔷 TypeScript Essentials quiz created with 6 questions");

    // ─── Quiz 7: CSS & Tailwind ───────────────────────────────────────
    const cssQuiz = await Quiz.create({
      title: "CSS & Tailwind",
      description: "Test your CSS fundamentals and Tailwind CSS utility-first knowledge.",
      timer: 8,
      createdBy: admin._id,
    });
    await Question.create([
      {
        quizId: cssQuiz._id,
        questionText: "What does flex-1 do in Tailwind CSS?",
        options: [
          { text: "Sets flex-direction to column", isCorrect: false },
          { text: "Sets flex: 1 1 0% — allows the element to grow and shrink", isCorrect: true },
          { text: "Adds a 1px border", isCorrect: false },
          { text: "Sets width to 100%", isCorrect: false },
        ],
      },
      {
        quizId: cssQuiz._id,
        questionText: "What is the CSS Box Model?",
        options: [
          { text: "A layout system for grid", isCorrect: false },
          { text: "Content, padding, border, and margin that wrap every element", isCorrect: true },
          { text: "A flexbox property", isCorrect: false },
          { text: "A CSS animation model", isCorrect: false },
        ],
      },
      {
        quizId: cssQuiz._id,
        questionText: "What does z-index control?",
        options: [
          { text: "Horizontal position", isCorrect: false },
          { text: "The stacking order of positioned elements", isCorrect: true },
          { text: "Zoom level", isCorrect: false },
          { text: "Element opacity", isCorrect: false },
        ],
      },
      {
        quizId: cssQuiz._id,
        questionText: "In Tailwind, what does the sm: prefix mean?",
        options: [
          { text: "Small font size", isCorrect: false },
          { text: "Applies styles at the sm breakpoint (640px) and above", isCorrect: true },
          { text: "Applies styles only on mobile", isCorrect: false },
          { text: "A spacing utility", isCorrect: false },
        ],
      },
      {
        quizId: cssQuiz._id,
        questionText: "What is CSS specificity?",
        options: [
          { text: "The order in which CSS files are loaded", isCorrect: false },
          { text: "A weight system that determines which CSS rule applies when multiple rules target the same element", isCorrect: true },
          { text: "The number of CSS properties in a rule", isCorrect: false },
          { text: "A browser compatibility feature", isCorrect: false },
        ],
      },
    ]);
    console.log("🎨 CSS & Tailwind quiz created with 5 questions");

    // ─── Quiz 8: System Design Basics ─────────────────────────────────
    const sysQuiz = await Quiz.create({
      title: "System Design Basics",
      description: "Fundamental system design concepts — scalability, caching, databases, and architecture.",
      timer: 15,
      createdBy: admin._id,
    });
    await Question.create([
      {
        quizId: sysQuiz._id,
        questionText: "What is horizontal scaling?",
        options: [
          { text: "Adding more CPU or RAM to an existing server", isCorrect: false },
          { text: "Adding more servers to distribute the load", isCorrect: true },
          { text: "Increasing database storage", isCorrect: false },
          { text: "Optimizing SQL queries", isCorrect: false },
        ],
      },
      {
        quizId: sysQuiz._id,
        questionText: "What is a CDN (Content Delivery Network)?",
        options: [
          { text: "A type of database", isCorrect: false },
          { text: "A distributed network of servers that delivers content to users from the nearest location", isCorrect: true },
          { text: "A load balancer", isCorrect: false },
          { text: "A caching algorithm", isCorrect: false },
        ],
      },
      {
        quizId: sysQuiz._id,
        questionText: "What is the purpose of a load balancer?",
        options: [
          { text: "To store session data", isCorrect: false },
          { text: "To distribute incoming traffic across multiple servers", isCorrect: true },
          { text: "To compress static assets", isCorrect: false },
          { text: "To manage database connections", isCorrect: false },
        ],
      },
      {
        quizId: sysQuiz._id,
        questionText: "What is eventual consistency in distributed systems?",
        options: [
          { text: "Data is always immediately consistent across all nodes", isCorrect: false },
          { text: "Given enough time without updates, all nodes will converge to the same value", isCorrect: true },
          { text: "A type of database transaction", isCorrect: false },
          { text: "A caching strategy", isCorrect: false },
        ],
      },
      {
        quizId: sysQuiz._id,
        questionText: "What is the difference between SQL and NoSQL databases?",
        options: [
          { text: "SQL is faster than NoSQL in all cases", isCorrect: false },
          { text: "SQL uses structured tables with fixed schemas; NoSQL uses flexible document, key-value, or graph models", isCorrect: true },
          { text: "NoSQL does not support queries", isCorrect: false },
          { text: "SQL databases cannot scale horizontally", isCorrect: false },
        ],
      },
      {
        quizId: sysQuiz._id,
        questionText: "What is caching and why is it used?",
        options: [
          { text: "Permanently storing data in a database", isCorrect: false },
          { text: "Temporarily storing frequently accessed data to reduce latency and database load", isCorrect: true },
          { text: "Compressing files for storage", isCorrect: false },
          { text: "Encrypting sensitive data", isCorrect: false },
        ],
      },
    ]);
    console.log("🏗️  System Design Basics quiz created with 6 questions");

    // ─── Sample attempt by student ────────────────────────────────────
    const existingAttempt = await Attempt.findOne({ userId: student._id, quizId: jsQuiz._id });
    if (!existingAttempt) {
      const answersArray = jsQuestions.map((q, i) => ({
        questionId: q._id,
        selectedOption: q.options[i % 2 === 0 ? 1 : 0]._id,
      }));
      const score = jsQuestions.filter((q, i) => q.options[i % 2 === 0 ? 1 : 0].isCorrect).length;
      await Attempt.create({ userId: student._id, quizId: jsQuiz._id, score, answers: answersArray });
      await User.findByIdAndUpdate(student._id, { $addToSet: { attemptedQuizzes: jsQuiz._id } });
      console.log(`📊 Sample attempt created for student (score: ${score}/${jsQuestions.length})`);
    }

    console.log("\n🎉 Seed complete!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Admin:   admin@quizzy.com   / admin123");
    console.log("  Student: student@quizzy.com / student123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedData();
