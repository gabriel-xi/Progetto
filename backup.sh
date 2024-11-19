#!/bin/bash

# Cartella di origine da cui vuoi fare il backup
SOURCE_DIR="/Users/gabriele/Desktop/Progetto"

# Cartella di destinazione per il clone
DEST_DIR="/Users/gabriele/Desktop/Social"

# URL del repository remoto su GitHub
REPO_URL="https://github.com/gabriel-xi/Progetto.git"

# Se la cartella di destinazione esiste già, rimuovila
if [ -d "$DEST_DIR" ]; then
  echo "La cartella di backup esiste già. La rimuovo..."
  rm -rf "$DEST_DIR"
fi

# Clona il repository remoto (se non esiste ancora)
echo "Clonando il repository da GitHub..."
git clone "$REPO_URL" "$DEST_DIR"

# Vai nella cartella di destinazione (quella appena clonata)
cd "$DEST_DIR"

# Aggiungi il contenuto della cartella di origine al repository clonata
echo "Aggiungendo i file dalla cartella di origine..."
cp -r "$SOURCE_DIR"/* "$DEST_DIR"

# Aggiungi tutte le modifiche
git add .

# Fai il commit delle modifiche
git commit -m "Backup automatico del contenuto della cartella"

# Pusha le modifiche al repository remoto
git push origin main

echo "Backup completato con successo!"
