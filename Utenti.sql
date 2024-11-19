USE Diary;


-- Creazione della tabella Users_type
CREATE TABLE IF NOT EXISTS Users_type (
    id INT,
    Tipologia VARCHAR(255),
    PRIMARY KEY (id)
);

-- Creazione della tabella Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT,
    nome VARCHAR(255),
    cognome VARCHAR(255),
    email VARCHAR(255),
    passw VARCHAR(255),
    user_type INT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_type) REFERENCES Users_type(id)
);

-- Inserimento dati nella tabella Users_type
INSERT INTO Users_type (id, Tipologia) VALUES
(0, 'Amministratore'),
(1, 'Utente'),
(2, 'Utente di sola lettura');

-- Inserimento dati nella tabella Users
INSERT INTO Users (id, nome, cognome, email, passw, user_type) VALUES
(1, 'Gabrile', 'Ciadamidaro', 'gabriolito01@gmail.com', 'arianh', 0);