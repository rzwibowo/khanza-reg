require('dotenv').config()

const mysql = require('mysql')

class dbUtil {
    connection = mysql.createConnection({
        host: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dateStrings: true
    })

    doQuery(q, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(q, args, (err, rows) => {
                if (err) { return reject(err) }
                resolve(rows)
            })
        })
    }

    closeDb() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) { return reject(err)}
                resolve();
            })
        })
    }
}

export { dbUtil }