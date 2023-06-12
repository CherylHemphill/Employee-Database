USE employee_db;

-- Insert example departments
INSERT INTO department (id, name)
VALUES (1, 'Design'),
       (2, 'Marketing'),
       (3, 'Web Development'),
       (4, 'Security'),
       (5, 'HR');

-- Insert example roles
INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Designer Manager', 60000, 1),
       (2, 'Junior Designer', 45000, 1),
       (3, 'Marketing Manager', 45000, 2),
       (4, 'Marketing Representative', 40000, 2)
       (5, 'Front-end Developer', 60000, 3),
       (6, 'Back-end Developer', 66000, 3),
       (7, 'Lead Developer', 78000, 3),
       (8, 'Cyber Analyst', 88000, 4),
       (9, 'Lead Cyber Analyst', 92000, 4),
       (10, 'Human Resource Lead', 50000, 5),
       (11, 'Human Resource', 35000, 5);

-- Insert example employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Marilyn', 'Monroe', 1, NULL),
       (2, 'Abraham', 'Lincoln', 2, 1),
       (3, 'Elivs', 'Presley', 3, NULL),
       (4, 'Jack', 'Sparrow', 4, 3)
       (5, 'Paul', 'McCartney', 5, 7),
       (6, 'David', 'Bowie', 6, 7),
       (7, 'Franklin', 'Roosevelt', 7, NULL),
       (8, 'Thomas', 'Edison', 8, 9),
       (9, 'Oprah', 'Winfrey', 9, NULL),
       (10, 'Walt', 'Disney', 10, NULL),
       (11, 'Steven', 'Tyler', 11, 10);
