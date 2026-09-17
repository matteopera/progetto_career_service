# Progetto Career Service UNIVR

Progetto per la gestione degli eventi organizzati da ufficio Career Service dell'Università di Verona.

Il principale scopo di questa webapp sarà:

- Raccolta dati aziende interessante alla partecipazione tramite apposito form
- Visualizzazione dei dati raccolti
- Esportazione e gestione dei dati in formato Excel (.xlsx)

Future implementazioni di altre funzionalità verranno aggiunte in seguito.

## Installazione progetto per sviluppo

Per avviare l'intero ambiente di sviluppo, bisogna seguire i seguenti passaggi:

1. Clonare la repository
   ```bash
   git clone https://github.com/matteopera/progetto_career_service
   cd progetto_career_service
   ```
2. Installare le dipendenze necessarie dal root del progetto
   ```bash
    npm install
   ```
3. Configurare le variabili d'ambiente:
   Creare un file `.env` nella cartella `/backend` con i seguenti dati:
   ```env
   PORT=porta_ascolto_backend #NB: controllare chiamate dove vanno. Ora il progetto è configurato per la porta 3000
   MONGO_URL="stringa di connessione del database"
   BETTER_AUTH_SECRET="stringa segreta casuale"
   BETTER_AUTH_URL="url di base del backend"
   ```
4. Avviare il progetto dalla root
   ```bash
    npm run dev
   ```

## Struttura del progetto

- `/frontend`: Frontend creato con React.
- `/backend`: Backend creato con Node/Express.js e driver di MongoDB.
