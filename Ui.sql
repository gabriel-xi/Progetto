USE Diary;

DROP TABLE IF EXISTS POST;
DROP TABLE IF EXISTS Chats;

-- Creazione della tabella Post
CREATE TABLE IF NOT EXISTS Post(
	id INT,
	sentimento VARCHAR(255),
	note VARCHAR(255),
    reazioni VARCHAR(255),
    commenti VARCHAR(255),
    id_user  INT,
    PRIMARY KEY (id),
    FOREIGN KEY (id_user) REFERENCES Users(id)
);
-- Creazione della tabella Chats
CREATE TABLE IF NOT EXISTS Chats(
	id INT,
    nome VARCHAR(255),
    stato INT,
    id_user VARCHAR(255),
    PRIMARY KEY(id_user),
    FOREIGN KEY (nome) REFERENCES Users(nome),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
);
