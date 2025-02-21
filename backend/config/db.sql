CREATE DATABASE IF NOT EXISTS usof_vzharyi;

GRANT ALL ON usof_vzharyi.* TO 'vzharyi'@'localhost';

USE usof_vzharyi;

create TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT NOT NULL,
    login           VARCHAR(30)                 NOT NULL,
    password        VARCHAR(255)                NOT NULL,
    full_name       VARCHAR(255)           DEFAULT NULL,
    email           VARCHAR(255)                NOT NULL,
    email_verified  BOOLEAN                DEFAULT FALSE,
    profile_picture VARCHAR(255),
    rating          INT UNSIGNED           DEFAULT 0,
    role            ENUM ('user', 'admin') DEFAULT 'user',
    createdAt       DATETIME               DEFAULT NULL,
    updatedAt       DATETIME               DEFAULT NULL,
    CONSTRAINT users_id_pk PRIMARY KEY (id),
    CONSTRAINT users_login_uq UNIQUE (login),
    CONSTRAINT users_email_uq UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS posts (
    id         INT UNSIGNED AUTO_INCREMENT NOT NULL,
    author_id  INT UNSIGNED                NOT NULL,
    title      VARCHAR(255)                NOT NULL,
    createdAt  DATETIME                    DEFAULT NULL,
    updatedAt  DATETIME                    DEFAULT NULL,
    rating     INT UNSIGNED                DEFAULT 0,
    likesCount INT UNSIGNED                DEFAULT 0,
    locked     BOOLEAN                     DEFAULT FALSE,
    status     ENUM ('active', 'inactive') DEFAULT 'active',
    content    TEXT                        NOT NULL,
    CONSTRAINT posts_id_pk PRIMARY KEY (id),
    CONSTRAINT posts_author_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id          INT UNSIGNED AUTO_INCREMENT NOT NULL,
    title       VARCHAR(255)                NOT NULL,
    createdAt   DATETIME                    DEFAULT NULL,
    updatedAt   DATETIME                    DEFAULT NULL,
    description TEXT,
    CONSTRAINT categories_id_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post_categories (
    post_id     INT UNSIGNED                NOT NULL,
    category_id INT UNSIGNED                NOT NULL,
    CONSTRAINT post_categories_pk PRIMARY KEY (post_id, category_id),
    CONSTRAINT post_categories_post_fk FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    CONSTRAINT post_categories_category_fk FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorite_post (
    user_id INT UNSIGNED                    NOT NULL,
    post_id INT UNSIGNED                    NOT NULL,
    CONSTRAINT user_post_pk PRIMARY KEY (user_id, post_id),
    CONSTRAINT user_post_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT user_post_post_fk FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id                INT UNSIGNED AUTO_INCREMENT NOT NULL,
    author_id         INT UNSIGNED NOT NULL,
    createdAt         DATETIME DEFAULT NULL,
    updatedAt         DATETIME DEFAULT NULL,
    post_id           INT UNSIGNED NOT NULL,
    content           TEXT NOT NULL,
    rating            INT UNSIGNED DEFAULT 0,
    parent_comment_id INT UNSIGNED DEFAULT NULL,
    CONSTRAINT comments_id_pk PRIMARY KEY (id),
    CONSTRAINT comments_author_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT comments_post_fk FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    CONSTRAINT comments_parent_fk FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id         INT UNSIGNED AUTO_INCREMENT NOT NULL,
    author_id  INT UNSIGNED                NOT NULL,
    createdAt  DATETIME                    DEFAULT NULL,
    updatedAt  DATETIME                    DEFAULT NULL,
    post_id    INT UNSIGNED                DEFAULT NULL,
    comment_id INT UNSIGNED                DEFAULT NULL,
    type       ENUM ('like', 'dislike')    NOT NULL,
    CONSTRAINT likes_id_pk PRIMARY KEY (id),
    CONSTRAINT likes_author_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT likes_post_fk FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    CONSTRAINT likes_comment_fk FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);


INSERT INTO users (login, password, full_name, email, email_verified, profile_picture, rating, role, createdAt, updatedAt)
VALUES
    ('vadym', '$2b$10$IsqjFkFZ/7uXgKOiIP0vcepICYW5tZDQIquW0kO9P6aV/NBMGrtpy', 'Vadym Zharyi', 'vad.zhary@gmail.com', TRUE, '/uploads/avatars/default.png', 0, 'admin', NOW(), NOW()),
    ('samm24', '$2b$10$lEsuG6XzPFM4zbQF9ws3a.YmPwXQlVDjjGCKyURR5fSnCiTsorXv.', 'Sammy Martin', 'sammy2024@example.com', FALSE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('webwizard88', '$2b$10$oheoC37jOd8hMoiFn0YYK.eR2Zas9EsIxyUXuk21z0iIyBTVU5MNW', 'Web Wizard', 'webwizard88@example.com', TRUE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('john', '$2b$10$m7NhIlxvBi90KuDwN3bmoe45z1bIPlDF7VgrINuUNbekIYLimFhGG', 'John Doe', 'johndoe42@example.com', FALSE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('lisacod', '$2b$10$mKx2TqeUFI12ugPEAAuEIeWe8Nd1ztsyW7tmTej8EzHyJSxeUM5k2', 'Lisa Coder', 'lisa_coder01@example.com', TRUE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('markus', '$2b$10$Lt0lt6ifS0P1jF0OfCgHTe2tS2F0RglPmRuR2HqWZ7xzgLnRYRMYm', 'Markus Schmidt', 'markus_7x@example.com', TRUE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('irina', '$2b$10$YSYkQdU7UVsDawYf3vlQUOQTeVzk3WJ6BehPLPESCvGARbPVOUAC2', 'Irina Dev', 'irina_dev123@example.com', FALSE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('daniel99', '$2b$10$6z1HIklqgF0spATvWnDJy.yiTj5Magoobcz7o38z5dKIJGt1udp3q', 'Daniel Tech', 'danieltech99@example.com', TRUE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('olga12', '$2b$10$IB0VDiGth8GqngldtKwG3esm0XBMiRRQnpyomVWAGkxnZkpfGOcma', 'Olga Dev', 'olga_dev@12@example.com', FALSE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW()),
    ('viktor99', '$2b$10$1MrRzCqvku6H.5Pj8vWb0e/uBJ3MZn5I3W7Rrg/MrobCqragjVAUy', 'Viktor Novak', 'viktor99@example.com', TRUE, '/uploads/avatars/default.png', 0, 'user', NOW(), NOW());

INSERT INTO posts (author_id, title, createdAt, updatedAt, rating, likesCount, locked, status, content)
VALUES
    (1, 'How to efficiently manage large datasets in Java?', '2024-10-03 12:00:00', NOW(), 0, 0, FALSE, 'inactive', 'I have a large dataset that I need to process in Java. What are some techniques or libraries that can help to efficiently manage and process this data? Any suggestions would be appreciated!'),
    (1, 'React useEffect hook issues with state updates', '2024-09-03 12:00:00', NOW(), 0, 0, FALSE, 'active', 'I\'m facing an issue with the useEffect hook in React. When I update the state inside useEffect, it\'s causing unexpected re-renders. Does anyone know why this might happen and how to avoid it?'),
    (2, 'Python memory management and garbage collection', NOW(), NOW(), 0, 0, FALSE, 'inactive', 'In Python, I\'ve noticed that memory usage increases rapidly with some data structures. How does garbage collection work in Python, and what can I do to optimize memory usage?'),
    (3, 'Best practices for creating APIs in Node.js', NOW(), NOW(), 0, 0, FALSE, 'active', 'I\'m building an API in Node.js. What are some best practices for API design, error handling, and ensuring scalability? I\'d love to hear some tips!'),
    (3, 'CSS Flexbox layout problems', '2024-10-01 12:00:00', NOW(), 0, 0, FALSE, 'active', 'I\'m trying to create a responsive layout using Flexbox, but I\'m having trouble with centering elements properly. Any advice on how to fix common Flexbox issues?'),
    (4, 'Understanding async/await in JavaScript', NOW(), NOW(), 0, 0, FALSE, 'active', 'Can someone explain the difference between callbacks, promises, and async/await in JavaScript? I\'m struggling to understand async/await and how it improves the readability of asynchronous code.'),
    (5, 'How to use MongoDB aggregation pipeline effectively', NOW(), NOW(), 0, 0, FALSE, 'active', 'I need to aggregate data from multiple collections in MongoDB. How do I use the aggregation pipeline effectively? What are the most common operations you use in aggregation?'),
    (6, 'How to handle errors in promises in Node.js', NOW(), NOW(), 0, 0, FALSE, 'active', 'I\'m learning Node.js and dealing with promises. What is the best way to handle errors in promises? Should I use .catch or try-catch with async/await?'),
    (7, 'TypeScript vs JavaScript - When to use TypeScript?', NOW(), NOW(), 0, 0, FALSE, 'active', 'I\'ve been using JavaScript for a while, but I\'m considering learning TypeScript. Can someone explain when it\'s worth using TypeScript over JavaScript? What are the main benefits of TypeScript?'),
    (8, 'Unit testing in React - Tools and practices', NOW(), NOW(), 0, 0, FALSE, 'active', 'I want to start writing unit tests for my React components. What tools and practices would you recommend for testing React components?'),
    (8, 'Performance optimization for large React apps', NOW(), NOW(), 0, 0, FALSE, 'inactive', 'As my React app grows, I\'ve noticed performance issues. What are some strategies to optimize the performance of large React applications?'),
    (9, 'Understanding closures in JavaScript', '2024-10-15 12:00:00', NOW(), 0, 0, FALSE, 'active', 'I am trying to understand closures in JavaScript, but I can\'t quite get my head around it. Can someone explain closures with an example? How do they work?'),
    (10, 'Troubleshooting C++ memory leaks', NOW(), NOW(), 0, 0, FALSE, 'active', 'I\'ve been working on a C++ project and am experiencing memory leaks. What tools and techniques can I use to identify and fix memory leaks in C++ programs?'),
    (10, 'Optimizing SQL queries for performance', NOW(), NOW(), 0, 0, FALSE, 'inactive', 'I have a database with a large amount of data, and some SQL queries are running very slowly. How can I optimize my SQL queries for better performance? Any tips for writing efficient queries?');

INSERT INTO categories (title, createdAt, updatedAt, description)
VALUES
    ('Java', NOW(), NOW(), 'A place to ask questions and share knowledge about Java programming, Java frameworks (like Spring, Hibernate), and best practices in Java development. Discuss issues such as performance optimization, memory management, and multi-threading in Java applications.'),
    ('React', NOW(), NOW(), 'Discussions on React.js, one of the most popular JavaScript libraries for building user interfaces. Topics include React hooks, component design, state management (like Redux), performance optimization, and integration with other tools and frameworks in the front-end ecosystem.'),
    ('Node.js', NOW(), NOW(), 'A community for developers working with Node.js, a runtime for JavaScript on the server side. Topics include building APIs, working with Express.js, real-time applications, authentication, deployment, and performance issues in back-end development using Node.js.'),
    ('Python', NOW(), NOW(), 'A hub for Python developers to ask questions, share libraries, and discuss Python-related topics. Whether you are working with web frameworks like Django or Flask, or diving into data science with Pandas and NumPy, this category covers all aspects of Python programming.'),
    ('SQL & DB Optimization', NOW(), NOW(), 'This category is dedicated to discussions on SQL queries, database management systems (MySQL, PostgreSQL, etc.), and techniques for optimizing database performance. Topics include indexing, query optimization, database design, and troubleshooting slow queries.'),
    ('TypeScript', NOW(), NOW(), 'A category for discussing TypeScript, a superset of JavaScript that adds static types. Topics include TypeScript’s syntax, type annotations, and how it improves JavaScript development. Also covers when and how to migrate from JavaScript to TypeScript, and integrating with modern frameworks like React.'),
    ('Software Testing', NOW(), NOW(), 'A space for discussions on software testing techniques, tools, and methodologies. Whether you are interested in unit testing, integration testing, or test automation, this category covers testing in various programming languages and frameworks, including best practices and tools like Jest, Mocha, Selenium, and more.');

INSERT INTO post_categories (post_id, category_id)
VALUES
    (1, 1),
    (1, 5),
    (2, 2),
    (2, 7),
    (3, 4),
    (3, 5),
    (4, 3),
    (4, 7),
    (5, 2),
    (6, 3),
    (7, 6),
    (8, 2),
    (8, 7),
    (9, 2),
    (9, 5),
    (10, 4),
    (11, 1),
    (11, 5),
    (12, 5),
    (12, 7);

INSERT INTO comments (author_id, createdAt, updatedAt, post_id, content, parent_comment_id)
VALUES
    (1, NOW(), NOW(), 1, 'I would recommend using Apache Spark for large dataset processing in Java. It can handle large-scale data processing efficiently.', NULL),
    (1, NOW(), NOW(), 1, 'You might also want to consider using Hadoop for distributed data processing.', NULL),
    (2, NOW(), NOW(), 2, 'It sounds like you have a problem with asynchronous state updates in useEffect. Try adding an empty dependency array to avoid re-renders.', NULL),
    (3, NOW(), NOW(), 2, 'Check if the state is being updated within a loop or another effect. That can lead to unintended re-renders as well.', NULL),
    (4, NOW(), NOW(), 3, 'In Python, garbage collection is handled automatically, but you can use the `gc` module to tune it for better performance.', NULL),
    (4, NOW(), NOW(), 3, 'Consider using memory profiling tools to identify memory leaks or excessive memory usage in Python.', NULL),
    (6, NOW(), NOW(), 4, 'For building scalable APIs in Node.js, using Express.js is a good choice. Also, consider using JWT for authentication.', NULL),
    (6, NOW(), NOW(), 4, 'Don\'t forget about error handling and logging. Winston or Morgan can help with logging in a Node.js application.', NULL),
    (1, NOW(), NOW(), 5, 'It sounds like you need to adjust the `align-items` and `justify-content` properties to properly center your elements.', NULL),
    (1, NOW(), NOW(), 5, 'Check if your parent container has the correct dimensions. Flexbox requires the parent container to have a defined width/height.', NULL),
    (8, NOW(), NOW(), 6, 'Async/await makes it easier to work with asynchronous code by allowing you to write it in a synchronous style. The main benefit is readability.', NULL),
    (8, NOW(), NOW(), 6, 'The key difference between callbacks and promises is that promises allow you to chain asynchronous operations, which prevents "callback hell".', NULL);

# INSERT INTO comments (author_id, createdAt, updatedAt, post_id, content, parent_comment_id)
# VALUES
#     (1, NOW(), NOW(), 1, 'Yes, Apache Spark is a great option, especially for big data. Don\'t forget to consider memory and computation overhead.', 1),
#     (2, NOW(), NOW(), 1, 'Hadoop is good for batch processing, but if you need real-time processing, Spark might be more suitable.', 2),
#     (5, NOW(), NOW(), 3, 'I know about the gc module, but I am more interested in ways to optimize memory management during runtime.', 1),
#     (6, NOW(), NOW(), 3, 'Yes, using tools like `memory_profiler` or `objgraph` can help you identify potential bottlenecks.', 2),
#     (6, NOW(), NOW(), 4, 'JWT is good for stateless authentication, but make sure to use secure cookies for better security.', 1),
#     (1, NOW(), NOW(), 4, 'I recommend using a centralized error handler for catching and processing all errors globally in the API.', 2),
#     (7, NOW(), NOW(), 5, 'I tried adjusting `align-items`, but the child elements still don\'t center. Could it be something with the child element styling?', 1),
#     (8, NOW(), NOW(), 5, 'I had a similar issue where I forgot to set the `flex-direction` to `row`. That might help.', 2),
#     (8, NOW(), NOW(), 6, 'I agree, async/await makes code much cleaner. But can you explain how errors are handled in async/await?', 1),
#     (8, NOW(), NOW(), 6, 'You can use try-catch blocks to handle errors in async/await. It works the same way as synchronous code.', 2);


INSERT INTO likes (author_id, createdAt, updatedAt, post_id, comment_id, type)
VALUES
    (2, NOW(), NOW(), 1, NULL, 'dislike'),
    (3, NOW(), NOW(), 1, NULL, 'like'),
    (4, NOW(), NOW(), 1, NULL, 'like'),
    (5, NOW(), NOW(), 2, NULL, 'like'),
    (6, NOW(), NOW(), 2, NULL, 'dislike'),
    (7, NOW(), NOW(), 2, NULL, 'like'),
    (8, NOW(), NOW(), 3, NULL, 'like'),
    (9, NOW(), NOW(), 3, NULL, 'dislike'),
    (10, NOW(), NOW(), 3, NULL, 'like'),
    (2, NOW(), NOW(), 4, NULL, 'like'),
    (3, NOW(), NOW(), 4, NULL, 'like'),
    (6, NOW(), NOW(), 4, NULL, 'dislike'),
    (5, NOW(), NOW(), 5, NULL, 'like'),
    (8, NOW(), NOW(), 5, NULL, 'dislike'),
    (9, NOW(), NOW(), 5, NULL, 'like'),
    (10, NOW(), NOW(), 6, NULL, 'like'),
    (2, NOW(), NOW(), 6, NULL, 'like'),
    (3, NOW(), NOW(), 7, NULL, 'dislike'),
    (4, NOW(), NOW(), 7, NULL, 'like'),
    (5, NOW(), NOW(), 8, NULL, 'like');
